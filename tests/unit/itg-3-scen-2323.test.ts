import { findSimilarPatterns, evaluatePatternRelevance, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2323
  test('適用可能な成功パターンが1件のときその1件の提案アプローチが返却される', () => {
    const dealCondition = {
      customerIndustry: 'manufacturing',
      customerScale: 'medium',
      challengeCategory: 'cost_reduction',
      budgetRange: 'high',
      purchasePhase: 'negotiation',
      customerId: 'CUST-001',
      dealId: 'DEAL-20240115-001',
    };

    const mockSimilarPattern = {
      patternId: 'PATTERN-SUCCESS-2023-0042',
      customerIndustry: 'manufacturing',
      challengeCategory: 'cost_reduction',
      successRate: 0.87,
      historicalDealCount: 12,
      approachDescription: 'Supply chain optimization through process standardization',
      keySuccessFactors: [
        'Executive sponsor engagement in week 2',
        'Pilot project scoping to 3-month timeline',
        'ROI calculation with 6-month payback period',
      ],
    };

    const relevanceScore = 0.82;

    const mockRecommendation = {
      proposalApproach: 'We recommend a phased supply chain optimization approach starting with process mapping and quick wins identification. Based on 12 similar manufacturing clients, this approach achieves 87% success rate with average 6-month payback period.',
      appliedPatternId: 'PATTERN-SUCCESS-2023-0042',
      applicabilityScore: 0.82,
      recommendationRationale: 'Your company profile (medium-scale manufacturer, cost reduction focus, high budget) closely matches successful cases from 2023. The proposed approach emphasizes executive alignment and pilot scoping, which proved critical in similar negotiations. Expected engagement timeline: 3-4 months to contract signature.',
      confidenceLevel: 82,
      alternativeApproaches: [],
    };

    const mockFindSimilarPatterns = jest
      .fn()
      .mockReturnValue([mockSimilarPattern]);

    const mockEvaluatePatternRelevance = jest
      .fn()
      .mockReturnValue(relevanceScore);

    const mockGenerateRecommendation = jest
      .fn()
      .mockReturnValue(mockRecommendation);

    const result = generateRecommendation(
      dealCondition,
      mockFindSimilarPatterns,
      mockEvaluatePatternRelevance
    );

    expect(result).toBeDefined();
    expect(result.proposalApproach).toBe(
      'We recommend a phased supply chain optimization approach starting with process mapping and quick wins identification. Based on 12 similar manufacturing clients, this approach achieves 87% success rate with average 6-month payback period.'
    );
    expect(result.appliedPatternId).toBe('PATTERN-SUCCESS-2023-0042');
    expect(result.applicabilityScore).toBe(0.82);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.8);
    expect(result.recommendationRationale).toBe(
      'Your company profile (medium-scale manufacturer, cost reduction focus, high budget) closely matches successful cases from 2023. The proposed approach emphasizes executive alignment and pilot scoping, which proved critical in similar negotiations. Expected engagement timeline: 3-4 months to contract signature.'
    );
    expect(result.confidenceLevel).toBe(82);
    expect(result.alternativeApproaches).toEqual([]);

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      mockSimilarPattern,
      dealCondition
    );
  });
});