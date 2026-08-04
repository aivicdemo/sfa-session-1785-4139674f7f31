import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2412
  test('推論精度スコア算出機能 - 照合評価結果がnullのとき、エラーが発生する', () => {
    const mockRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerId: 'CUST_001',
      proposalContent: 'Enterprise solution package',
      pastPatternMatchResult: {
        matchScore: 0.85,
        applicablePatterns: ['pattern_enterprise_001', 'pattern_enterprise_002'],
      },
    };

    expect(() => {
      evaluateRecommendationAccuracy(dealCondition, mockRecommendationEngine);
    }).toThrow(/照合評価結果/);
  });
});