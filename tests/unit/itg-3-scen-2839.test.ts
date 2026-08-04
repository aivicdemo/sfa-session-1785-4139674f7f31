import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2839
  test('新規案件の顧客属性が過去成功パターンと一致した場合、適用可能スコアが高く算出される', async () => {
    const stub_evaluatePatternRelevance = jest.fn().mockResolvedValue({
      relevanceScore: 0.92,
      matchedPatternId: 'pattern_mfg_500_1000',
    });

    const stub_findSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: 'pattern_mfg_500_1000',
        industry: '製造業',
        employeeRangeMin: 500,
        employeeRangeMax: 1000,
        budgetMin: 5000000,
        budgetMax: 10000000,
        purchaseDecisionFlow: '3段階承認',
        successRate: 0.85,
        successExamples: [
          {
            dealId: 'deal_001',
            customerId: 'cust_101',
            approachType: '経営効率化提案',
            adoptionRate: 0.92,
          },
          {
            dealId: 'deal_002',
            customerId: 'cust_102',
            approachType: '経営効率化提案',
            adoptionRate: 0.88,
          },
        ],
      },
    ]);

    const stub_explainRecommendationReasoning = jest.fn().mockResolvedValue(
      '製造業の類似規模企業での成功実績を基に提案アプローチを推奨します'
    );

    const newDealInput = {
      customerId: 'cust_new_001',
      customerName: '新規製造企業',
      industry: '製造業',
      employeeCount: 750,
      budgetAmount: 8000000,
      purchaseDecisionFlow: '3段階承認',
    };

    const aiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: stub_findSimilarPatterns,
      evaluatePatternRelevance: stub_evaluatePatternRelevance,
      explainRecommendationReasoning: stub_explainRecommendationReasoning,
    };

    aiRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendationId: 'rec_2839_001',
      dealId: newDealInput.customerId,
      proposedApproach: '経営効率化提案',
      applicabilityScore: 0.92,
      matchStatus: 'PATTERN_MATCHED',
      matchIndicator: '★★★★★ (92/100)',
      reasoningExplanation:
        '製造業の類似規模企業での成功実績を基に提案アプローチを推奨します',
      confidenceLevel: 92,
      matchedPatternDetails: {
        patternId: 'pattern_mfg_500_1000',
        industry: '製造業',
        employeeRange: '500～1000名',
        budgetRange: '500万円～1000万円',
        purchaseDecisionFlow: '3段階承認',
        historicalSuccessRate: 0.85,
      },
      generatedAt: new Date('2024-11-15T10:30:00Z').toISOString(),
    });

    const result = await generateRecommendation(newDealInput, aiRecommendationEngine);

    expect(result).toBeDefined();
    expect(result.applicabilityScore).toBe(0.92);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.8);
    expect(result.matchStatus).toBe('PATTERN_MATCHED');
    expect(result.matchIndicator).toBe('★★★★★ (92/100)');
    expect(result.reasoningExplanation).toBe(
      '製造業の類似規模企業での成功実績を基に提案アプローチを推奨します'
    );
    expect(result.confidenceLevel).toBe(92);
    expect(result.matchedPatternDetails).toEqual({
      patternId: 'pattern_mfg_500_1000',
      industry: '製造業',
      employeeRange: '500～1000名',
      budgetRange: '500万円～1000万円',
      purchaseDecisionFlow: '3段階承認',
      historicalSuccessRate: 0.85,
    });
    expect(result.proposedApproach).toBe('経営効率化提案');

    expect(stub_findSimilarPatterns).toHaveBeenCalledWith({
      industry: '製造業',
      employeeCount: 750,
      budgetAmount: 8000000,
      purchaseDecisionFlow: '3段階承認',
    });

    expect(stub_evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: '製造業',
        employeeCount: 750,
        budgetAmount: 8000000,
      }),
      expect.any(Object)
    );

    expect(stub_explainRecommendationReasoning).toHaveBeenCalled();
  });
});