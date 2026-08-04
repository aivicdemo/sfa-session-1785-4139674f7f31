import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2449
  test('過去商談の成功率が1件のときスコア計算に組み込まれる', () => {
    const pastDealsData = [
      {
        id: 'deal_001',
        customerIndustry: '製造業',
        proposedProduct: 'ERP導naviシステム',
        success: true,
        closedAt: '2024-01-15T10:30:00Z'
      }
    ];

    const newDealCondition = {
      customerIndustry: '製造業',
      dealSize: '中規模',
      proposedProduct: 'ERP導naviシステム'
    };

    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
        matchedPatternCount: 1,
        patternDetails: [
          {
            pastDealId: 'deal_001',
            relevanceScore: 0.85
          }
        ]
      })
    };

    const result = evaluateRecommendationAccuracy(
      pastDealsData,
      newDealCondition,
      aiEngineStub
    );

    expect(result.recommendationAccuracyScore).toBe(0.85);
    expect(result.successfulDealsCount).toBe(1);
    expect(result.pastDealsIncludedInCalculation).toBe(1);
    expect(result.metadata).toEqual(
      expect.objectContaining({
        pastSuccessfulCasesCount: '1件',
        successRate: 1.0
      })
    );
  });
});