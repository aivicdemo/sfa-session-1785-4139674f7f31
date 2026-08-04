import { generateRecommendationReport } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能 - S3アップロード失敗時の代替処理', () => {
  // SCEN-1591
  test('Amazon S3へのPDFアップロード失敗時に、推奨内容がHTML形式で画面表示され、ユーザーメッセージが表示されること', async () => {
    const recommendationData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社サンプル',
      industry: '製造業',
      scale: '中堅企業',
      approachStrategy: '提案アプローチ: 経営効率化による10%のコスト削減を実現',
      successPatternId: 'PATTERN-2024-001',
      successRate: 78,
      estimatedClosingProbability: 0.82,
      recommendedTimeline: '2024-02-15',
      rootCauseAnalysis: '過去の同業種・規模顧客の成功事例から、コスト削減ニーズが購買決定のトリガーとなることを確認',
    };

    const failedUploadError = new Error('ServiceUnavailable');

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(failedUploadError),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(recommendationData),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await generateRecommendationReport(
      recommendationData,
      mockFileStorageAdapter,
      mockAIRecommendationEngine,
    );

    expect(result.uploadSuccess).toBe(false);
    expect(result.fallbackExecuted).toBe(true);
    expect(result.displayFormat).toBe('html');
    expect(result.userMessage).toBe('レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください');
    expect(result.htmlContent).toBeDefined();
    expect(typeof result.htmlContent).toBe('string');
    expect(result.htmlContent.length).toBeGreaterThan(0);
    expect(result.htmlContent).toContain('<html');
    expect(result.htmlContent).toContain(recommendationData.customerName);
    expect(result.htmlContent).toContain(recommendationData.approachStrategy);
    expect(result.browserSaveEnabled).toBe(true);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
  });
});