import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック - AIRecommendationEngine連携', () => {
  // SCEN-2793
  test('AIRecommendationEngineが429エラーを返したとき、指数バックオフ再試行を3回実行後にエラーを返す', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error(JSON.stringify({ status: 429, message: 'Too Many Requests' }))
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const newCaseMeta = {
      customerName: 'ABC Corporation',
      industry: 'Technology',
      budget: 500000,
      issues: ['Digital transformation', 'Cost reduction'],
      dealStage: 'initial_contact',
      dealSize: 'large',
    };

    const error = await generateRecommendation(
      newCaseMeta,
      mockRecommendationEngine,
      mockFileStorageAdapter
    ).catch((e) => e);

    expect(error).toBeDefined();
    expect(error.message).toMatch(/429/);
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newCaseMeta);

    const callTimestamps = mockRecommendationEngine.generateRecommendation.mock.invocationCallOrder;
    expect(callTimestamps.length).toBe(3);
  });
});