import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - フォールバック機能', () => {
  // SCEN-2297
  test('AIRecommendationEngineのタイムアウトとフォールバック全失敗時にエラーを返す', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API timeout')),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationPatternMaster = [];
    const mockRecommendationHistoryCache = [];

    const newCaseData = {
      customerId: 'test-customer-001',
      dealAmount: 5000000,
      industry: '製造業',
    };

    const executeRecommendation = async () => {
      return generateRecommendationWithFallback(
        newCaseData,
        mockAIEngine,
        mockRecommendationPatternMaster,
        mockRecommendationHistoryCache
      );
    };

    await expect(executeRecommendation()).rejects.toThrow(/ERR_NO_FALLBACK_AVAILABLE/);
  });
});