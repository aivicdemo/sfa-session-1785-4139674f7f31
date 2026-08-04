import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1715
  test('成功パターンマッチ度が0.1%のとき推奨スコアを0.1で計算する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.001),
    };

    const newCaseData = {
      customerIndustry: 'IT',
      customerSize: 'mid-market',
      dealAmount: 5000000,
      dealStage: 'proposal',
      customerChallenges: ['cost_reduction', 'efficiency'],
    };

    const recommendationScore = evaluateRecommendationRelevance(
      newCaseData,
      mockAIEngine
    );

    expect(recommendationScore).toBe(0.1);
  });
});