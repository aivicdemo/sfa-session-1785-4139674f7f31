import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-357
  test('新規案件条件が未指定のとき、パターン照合がエラーになる', async () => {
    const newDealCondition = {
      customerName: null,
      dealAmount: undefined,
      industry: null,
      challenge: undefined,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          successRate: 0.85,
          customerIndustry: 'IT',
          dealAmountRange: { min: 1000000, max: 5000000 },
          keyChallenge: 'Digital Transformation',
        },
      ]),
      evaluatePatternRelevance: jest.fn(),
    };

    await expect(
      evaluatePatternRelevance(newDealCondition, mockAIRecommendationEngine)
    ).rejects.toThrow(/MISSING_REQUIRED_CONDITION/);
  });
});