import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ダウンロードURL生成', () => {
  test('SCEN-1069: 推奨レポート生成時にAmazon S3から有効期限付きダウンロードURLが正常に取得される', async () => {
    // Arrange: FileStorageAdapterのスタブ設定
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        reportId: 'report-001',
        uploadedAt: '2026-08-01T11:30:00Z'
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: 'https://s3.amazonaws.com/bucket/report-xxx.pdf?X-Amz-Signature=sig123456',
        expiresIn: 3600,
        generatedAt: '2026-08-01T12:00:00Z'
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue(true)
    };

    const recommendationInput = {
      customerId: 'cust-001',
      dealId: 'deal-001',
      recommendedApproach: '顧客の購買シグナルに基づいた即座のフォローアップ実施',
      confidenceScore: 87,
      basePatterns: [
        {
          patternId: 'pat-001',
          description: '過去12ヶ月での類似顧客の購買タイミング',
          matchRate: 0.92
        }
      ],
      riskFactors: [
        {
          factorId: 'risk-001',
          description: '予算制約の可能性',
          mitigationStrategy: '段階的な提案に変更'
        }
      ]
    };

    // Act: 推奨レポート生成処理を実行
    const downloadUrlResult = await generateRecommendationReport(
      recommendationInput,
      mockFileStorageAdapter
    );

    // Assert: generateDownloadUrlが呼び出されたことを確認
    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalled();

    // Assert: 返却されたURLオブジェクトの内容を検証
    expect(downloadUrlResult).toEqual({
      url: 'https://s3.amazonaws.com/bucket/report-xxx.pdf?X-Amz-Signature=sig123456',
      expiresIn: 3600,
      generatedAt: '2026-08-01T12:00:00Z'
    });

    // Assert: URL形式の妥当性確認
    expect(downloadUrlResult.url).toMatch(/^https:\/\/s3\.amazonaws\.com\//);
    expect(downloadUrlResult.url).toMatch(/X-Amz-Signature=/);

    // Assert: 有効期限が1時間(3600秒)に設定されていることを確認
    expect(downloadUrlResult.expiresIn).toBe(3600);

    // Assert: タイムスタンプがISO 8601形式で記録されていることを確認
    expect(downloadUrlResult.generatedAt).toBe('2026-08-01T12:00:00Z');
    expect(new Date(downloadUrlResult.generatedAt)).toBeInstanceOf(Date);
  });
});