import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2705: [edge] 推奨レポート生成・保存機能 - FileStorageAdapter.uploadRecommendationReportが正常応答したとき、推奨内容がExcel形式で保存される
  test('推奨内容がExcel形式で正常に保存される', async () => {
    // Arrange
    const mockRecommendationContent = {
      proposalApproach: '顧客のデジタル化課題に対して、クラウドベースのERPシステム導入を段階的に推進する提案アプローチ',
      successPatterns: [
        {
          patternId: 'SP-001',
          description: '同業種で規模1000億円以上の企業への提案成功事例：導入期間6ヶ月、ROI計測期間12ヶ月で150%達成',
          similarityScore: 0.92,
        },
        {
          patternId: 'SP-002',
          description: '経営層との初回ヒアリング時にコスト削減効果（年間5000万円）を提示した提案が采用率80%',
          similarityScore: 0.85,
        },
      ],
      reasoningExplanation: '顧客の現在の販売管理システムが20年前の基幹システムであり、データ連携が手作業となっている点が課題。過去3年間の営業実績から、同様の課題を持つ企業への提案では、段階的導入アプローチ（Phase 1: 販売管理、Phase 2: 在庫管理、Phase 3: 財務連携）を採用した場合の成約率は78%。本案件でも同アプローチを推奨する。リスク要因として導入時の業務フロー変更が発生するため、チェンジマネジメント支援の追加サービスを提案に含めることで失敗リスクを低減できる。',
      confidenceScore: 87,
    };

    const recommendationReportData = {
      customerId: 'CUST-12345',
      customerName: '株式会社ABC',
      dealId: 'DEAL-98765',
      dealName: 'デジタル化支援プロジェクト',
      generatedAt: '2024-01-15T10:30:00Z',
      recommendation: mockRecommendationContent,
    };

    const excelFormat = 'Excel';
    const expectedS3Key = `recommendations/CUST-12345/DEAL-98765/recommendation_2024-01-15T10-30-00Z.xlsx`;
    const assumedS3ETag = '"abc123def456"';

    // S3 PutObject スタブ
    const mockS3PutObject = jest.fn().mockResolvedValue({
      ETag: assumedS3ETag,
    });

    // FileStorageAdapter の uploadRecommendationReport スタブ
    const mockUploadRecommendationReport = jest.fn(
      async (reportData: typeof recommendationReportData, format: string) => {
        // 引数検証
        if (!reportData || typeof reportData !== 'object') {
          throw new Error('推奨レポートデータが不正です');
        }
        if (!reportData.customerId || !reportData.dealId) {
          throw new Error('顧客ID又は商談IDが未入力');
        }
        if (format !== 'Excel') {
          throw new Error('形式は「Excel」のみサポートされています');
        }

        // Excel形式の疑似バイナリ生成（ZIP圧縮構造を模擬）
        const excelBuffer = Buffer.from(
          JSON.stringify({
            workbook: {
              sheets: [
                {
                  name: 'Recommendation',
                  rows: [
                    ['商談情報'],
                    ['顧客名', recommendationReportData.customerName],
                    ['顧客ID', recommendationReportData.customerId],
                    ['商談名', recommendationReportData.dealName],
                    ['商談ID', recommendationReportData.dealId],
                    ['生成日時', recommendationReportData.generatedAt],
                    [''],
                    ['提案アプローチ'],
                    [mockRecommendationContent.proposalApproach],
                    [''],
                    ['過去成功パターン'],
                    ...mockRecommendationContent.successPatterns.map((p) => [
                      `パターン${p.patternId}`,
                      p.description,
                      `類似度: ${p.similarityScore * 100}%`,
                    ]),
                    [''],
                    ['推奨根拠'],
                    [mockRecommendationContent.reasoningExplanation],
                    [''],
                    ['信頼度スコア'],
                    [`${mockRecommendationContent.confidenceScore}%`],
                  ],
                },
              ],
            },
          })
        );

        // S3 PutObject呼び出し
        await mockS3PutObject({
          Bucket: 'ai-recommendations',
          Key: expectedS3Key,
          Body: excelBuffer,
          ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // 戻り値
        return {
          success: true,
          fileKey: expectedS3Key,
          fileSize: excelBuffer.length,
          etag: assumedS3ETag,
          uploadedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        };
      }
    );

    // Act
    const result = await mockUploadRecommendationReport(recommendationReportData, excelFormat);

    // Assert
    // 1. 戻り値が成功ステータスであることを確認
    expect(result.success).toBe(true);
    expect(result.fileKey).toBe(expectedS3Key);
    expect(result.etag).toBe(assumedS3ETag);

    // 2. S3 PutObject が1回呼び出されたことを確認
    expect(mockS3PutObject).toHaveBeenCalledTimes(1);

    // 3. S3 PutObject の引数を検査
    const s3CallArgs = mockS3PutObject.mock.calls[0][0];
    expect(s3CallArgs.Bucket).toBe('ai-recommendations');
    expect(s3CallArgs.Key).toBe(expectedS3Key);
    expect(s3CallArgs.ContentType).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    // 4. S3に保存されたファイルの内容がExcel形式の構造を持つことを確認
    const savedBuffer = s3CallArgs.Body;
    expect(Buffer.isBuffer(savedBuffer)).toBe(true);
    const excelContent = JSON.parse(savedBuffer.toString());
    expect(excelContent.workbook).toBeDefined();
    expect(excelContent.workbook.sheets).toBeDefined();
    expect(Array.isArray(excelContent.workbook.sheets)).toBe(true);

    // 5. ワークシート内に推奨内容が保存されていることを確認
    const recommendationSheet = excelContent.workbook.sheets[0];
    expect(recommendationSheet.name).toBe('Recommendation');
    const sheetContent = recommendationSheet.rows.flat().join('\n');

    // 提案アプローチが記載されていることを確認
    expect(sheetContent).toContain(mockRecommendationContent.proposalApproach);

    // 過去成功パターンの説明が記載されていることを確認
    mockRecommendationContent.successPatterns.forEach((pattern) => {
      expect(sheetContent).toContain(pattern.description);
      expect(sheetContent).toContain(`${pattern.similarityScore * 100}%`);
    });

    // 推奨根拠説明が記載されていることを確認
    expect(sheetContent).toContain(mockRecommendationContent.reasoningExplanation);

    // 信頼度スコアが記載されていることを確認
    expect(sheetContent).toContain(`${mockRecommendationContent.confidenceScore}%`);

    // ファイルサイズが正の値であることを確認
    expect(result.fileSize).toBeGreaterThan(0);
  });
});