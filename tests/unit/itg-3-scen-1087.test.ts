import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1087
  test('過去成功パターンデータが0件のとき、推奨生成処理がエラーになる', async () => {
    const newDealData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: 'large',
      budget: 5000000,
      dealStage: 'negotiation',
      proposedApproach: 'product_demo',
      timeline: '2024-02-15',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(undefined),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyPatternMaster: any[] = [];

    const result = await generateRecommendation(
      newDealData,
      mockAIEngine,
      emptyPatternMaster
    );

    expect(result).toBeDefined();
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('NO_PATTERN_FOUND');
    expect(result.errorMessage).toMatch(/過去成功パターンが存在しないため/);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
  });
});