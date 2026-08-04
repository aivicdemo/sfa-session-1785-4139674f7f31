import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1103
  test('推奨根拠の信頼度スコアが0未満のとき、根拠表示処理がエラーになる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: -0.5,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationPattern = {
      patternId: 'pattern-001',
      customerId: 'customer-001',
      trustScore: -0.5,
      proposalApproach: 'approach-001',
      successFactors: ['factor-1', 'factor-2'],
      pastCaseData: [
        {
          caseId: 'case-001',
          industry: 'technology',
          companySize: 'large',
          contractValue: 5000000,
        },
      ],
    };

    expect(() => {
      explainRecommendationReasoning(recommendationPattern, mockAIEngine);
    }).toThrow(/信頼度スコアが不正です/);
  });
});