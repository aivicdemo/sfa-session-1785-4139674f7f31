import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1711
  test('成功パターンマッチ度がちょうど100%のとき推奨スコアを100で計算する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.0),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealConditions = {
      customerIndustry: 'IT',
      companySizeEmployee: 1500,
      dealAmount: 5000000,
      dealStage: 'proposal',
      customerChallenges: ['cost_reduction', 'process_efficiency'],
    };

    const result = evaluateRecommendationScore(dealConditions, mockAIEngine);

    expect(typeof result).toBe('number');
    expect(result).toBe(100);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealConditions);
  });
});