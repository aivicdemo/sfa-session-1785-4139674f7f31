import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1697
  test('照合評価スコアが100を超えるときエラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      dealAmount: 5000000,
      proposalContent: 'クラウドシステム導入',
    };

    const invoke = () =>
      evaluatePatternRelevance(dealCondition, mockAIRecommendationEngine);

    expect(invoke).toThrow(/照合評価スコア/);
  });
});