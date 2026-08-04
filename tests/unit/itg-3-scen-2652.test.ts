import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  // SCEN-2652
  test('適用可能な成功パターンが0件のとき、エラーが返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
    };

    const dealCondition = {
      customerIndustry: '製造業',
      dealAmount: '5000万円',
      decisionMakers: 3,
    };

    const result = evaluatePatternRelevance(dealCondition, mockAIRecommendationEngine);

    expect(result).toEqual({
      errorCode: 'PATTERN_NOT_FOUND',
      errorMessage: '適用可能な成功パターンが見つかりません。営業支援チームにお問い合わせください',
      httpStatusCode: 400,
      recommendationContent: undefined,
      reasoning: undefined,
      matchScore: undefined,
    });
  });
});