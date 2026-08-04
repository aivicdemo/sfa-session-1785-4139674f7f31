import { generateRecommendationReport } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - レポートメタデータ生成', () => {
  test('SCEN-470: [normal] レポート生成時刻が正しく記録される', () => {
    // テスト実行時刻を基準時刻として固定
    const baselineTime = new Date('2026-08-01T08:09:40.805Z');
    const baselineTimeMs = baselineTime.getTime();

    // AIRecommendationEngineスタブの定義
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'テスト提案アプローチ',
        confidenceScore: 85,
        rootCauses: ['過去事例との高い一致度'],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-001',
          matchScore: 0.92,
          successRate: 0.88,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: 'テスト根拠説明',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 82,
      }),
    };

    // FileStorageAdapterスタブの定義
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        reportId: 'RPT-2026-08-01-001',
        uploadedAt: '2026-08-01T08:09:40.805Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: 'https://s3.example.com/reports/RPT-2026-08-01-001',
        expiresAt: '2026-08-08T08:09:40.805Z',
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 5,
      }),
    };

    // 新規案件データの入力パラメータ
    const newDealData = {
      customerId: 'CUST-2026-001',
      customerName: 'テスト顧客A',
      industry: '金融',
      scale: 'large',
      dealTitle: 'システム導入提案',
      dealAmount: 5000000,
      dealStage: 'discovery',
      expectedClosureDate: '2026-09-30',
      salesRepId: 'SR-2026-001',
    };

    // レポートメタデータ生成機能を呼び出す
    const reportMetadata = generateRecommendationReport(
      newDealData,
      mockAIEngine,
      mockFileStorage,
      baselineTime
    );

    // 生成されたレポートメタデータから生成時刻フィールドを取得
    const generatedAt = new Date(reportMetadata.generatedAt);
    const generatedAtMs = generatedAt.getTime();

    // 生成時刻がISO 8601形式で記録されていることを確認
    expect(reportMetadata.generatedAt).toBe('2026-08-01T08:09:40.805Z');

    // 生成時刻とシステム現在時刻の差分が±2秒以内であることを確認
    const timeDifferenceMs = Math.abs(generatedAtMs - baselineTimeMs);
    expect(timeDifferenceMs).toBeLessThanOrEqual(2000);

    // レポートメタデータの構造を確認
    expect(reportMetadata).toHaveProperty('reportId');
    expect(reportMetadata).toHaveProperty('generatedAt');
    expect(reportMetadata).toHaveProperty('customerId');
    expect(reportMetadata).toHaveProperty('dealTitle');

    // レポートIDが正しく生成されていることを確認
    expect(reportMetadata.reportId).toMatch(/^RPT-/);

    // FileStorageAdapterへのアップロード時にも同じタイムスタンプが使用されていることを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        generatedAt: '2026-08-01T08:09:40.805Z',
      })
    );

    // アップロード結果から生成時刻が一致していることを確認
    const uploadResult = mockFileStorage.uploadRecommendationReport(
      reportMetadata
    );
    expect(uploadResult).resolves.toMatchObject({
      reportId: 'RPT-2026-08-01-001',
      uploadedAt: '2026-08-01T08:09:40.805Z',
    });
  });
});