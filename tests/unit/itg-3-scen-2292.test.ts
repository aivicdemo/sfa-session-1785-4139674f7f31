import { detectAndVisualizeAnomalies } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2292
  test('異常パターンが0件のとき、可視化処理をスキップして正常完了する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      industryType: '製造業',
      companySize: '大企業',
      dealStage: '提案段階',
      productCategory: 'システム導入',
      expectedAmount: 50000000,
      forecastedClosureDate: '2026-12-31',
      dealId: 'DEAL-2292-001',
    };

    const result = detectAndVisualizeAnomalies(
      dealConditions,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      anomaliesDetected: 0,
      visualizationSkipped: true,
      message: '検出された異常パターンはありません',
      internalLog: '可視化対象なし、スキップ',
    });

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealConditions
    );
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});