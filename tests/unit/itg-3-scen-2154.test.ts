import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性の評価', () => {
  // SCEN-2154
  test('AIRecommendationEngine.evaluatePatternRelevance の評価スコアが100を超える値のとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const dealCondition = {
      customerIndustry: 'manufacturing',
      customerSize: 'enterprise',
      dealStage: 'proposal',
      productCategory: 'software',
    };

    const successPattern = {
      industryMatch: 'manufacturing',
      sizeMatch: 'enterprise',
      approachType: 'consultative',
      recommendedActions: ['technical_demo', 'business_case'],
    };

    expect(() => {
      evaluatePatternRelevance(
        dealCondition,
        successPattern,
        mockAIEngine,
      );
    }).toThrow(/スコアは0から100の間である必要があります/);
  });
});