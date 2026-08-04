import { calculateDeviationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と標準プロセスの乖離度算出', () => {
  // SCEN-2121
  test('成功パターンの各要素がnullを含むとき、バリデーションエラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          proposalContent: null,
          standardProcess: {
            stage: 'initial_contact',
            expectedAction: 'needs_analysis',
            successRate: 0.75,
          },
          relevanceScore: 0.82,
          pastCaseId: 'case_001',
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const currentProposal = {
      customerId: 'cust_123',
      proposalContent: 'product_bundle_A',
      stage: 'initial_contact',
      customerAttribute: {
        industry: 'manufacturing',
        size: 'mid_enterprise',
      },
    };

    expect(() =>
      calculateDeviationScore(
        currentProposal,
        mockAIRecommendationEngine.findSimilarPatterns(),
      ),
    ).toThrow(/成功パターンの必須要素/);
  });
});