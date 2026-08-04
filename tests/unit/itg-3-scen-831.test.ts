import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-831
  test('顧客IDが空文字列のとき、エラーをスロー', () => {
    const emptyCustomerId = '';
    const dealConditions = {
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      timeline: 'Q2'
    };
    const aiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() =>
      generateRecommendation(emptyCustomerId, dealConditions, aiRecommendationEngine)
    ).toThrow(/顧客ID/);
  });
});