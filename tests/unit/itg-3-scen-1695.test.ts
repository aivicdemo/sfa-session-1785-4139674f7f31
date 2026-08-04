import { extractAndMatchSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1695
  test('照合評価スコアが null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat-001',
          customerIndustry: 'IT',
          customerSize: 'large',
          proposalApproach: 'technology_focus',
          successRate: 0.85,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: null,
        matchingFactors: ['industry_match'],
        mismatchingFactors: [],
      }),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInfo = {
      customerId: 'cust-123',
      customerIndustry: 'IT',
      customerSize: 'large',
      dealAmount: 500000,
      dealStage: 'proposal',
    };

    const extractedPatterns = [
      {
        patternId: 'pat-001',
        customerIndustry: 'IT',
        customerSize: 'large',
        proposalApproach: 'technology_focus',
        successRate: 0.85,
      },
    ];

    expect(() =>
      extractAndMatchSuccessPatterns(
        extractedPatterns,
        newDealInfo,
        mockAIEngine
      )
    ).toThrow(/照合評価スコア/);
  });
});