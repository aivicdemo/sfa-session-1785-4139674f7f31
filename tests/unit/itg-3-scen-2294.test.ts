import { detectAnomalousPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2294
  test('異常パターン検出・可視化機能 - 過去商談データが1件のみの場合、統計的な比較基準がなく異常検出がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          dealId: 'deal-001',
          customerId: 'cust-001',
          customerIndustry: '製造業',
          dealAmount: 5000000,
          dealStage: '提案',
          outcomeFlag: true,
          createdAt: '2024-01-10T10:00:00Z',
        },
      ]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'cust-001',
      customerIndustry: '製造業',
      dealAmount: 4500000,
      dealStage: '提案',
      dealConditions: {
        decisionMakersCount: 3,
        implementationTimeline: 6,
        budgetConfirmed: true,
      },
      proposalApproach: {
        channelStrategy: 'direct',
        focusArea: 'cost_reduction',
        proposedProducts: ['product-a', 'product-b'],
      },
    };

    expect(() => {
      detectAnomalousPatterns(newDealData, mockAIRecommendationEngine);
    }).toThrow(/最小件数|不足/);
  });
});