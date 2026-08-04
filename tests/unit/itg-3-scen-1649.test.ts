import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1649
  test('推奨スコア算出機能 - 推奨タイミング算出値が null のとき、エラーが発生する', () => {
    const customerId = 'C001';
    const dealConditions = {
      industry: '製造業',
      budget: '500万円以上',
      decisionMaker: '経営層',
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    expect(() => {
      calculateRecommendationScore(customerId, dealConditions, mockAIRecommendationEngine);
    }).toThrow(/推奨タイミング/);
  });
});