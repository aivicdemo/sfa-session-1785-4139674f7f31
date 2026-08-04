import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - 適合度がちょうど閾値の場合', () => {
  // SCEN-1285
  test('顧客条件の適合度がちょうど閾値（75%）の成功パターンが検索結果に含まれ、昇順でソートされること', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern, conditions) => {
        const patternScores: { [key: string]: number } = {
          'pattern_70': 70.0,
          'pattern_75': 75.0,
          'pattern_80': 80.0,
        };
        return patternScores[pattern.id] || 0;
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const referencePatterns = [
      {
        id: 'pattern_70',
        pastDealId: 'deal_001',
        customerInfo: { industry: 'IT', size: 'large', budget: 5000000 },
        recommendedApproach: 'Approach A',
        relevanceScore: 70.0,
      },
      {
        id: 'pattern_75',
        pastDealId: 'deal_002',
        customerInfo: { industry: 'Finance', size: 'large', budget: 5000000 },
        recommendedApproach: 'Approach B',
        relevanceScore: 75.0,
      },
      {
        id: 'pattern_80',
        pastDealId: 'deal_003',
        customerInfo: { industry: 'Manufacturing', size: 'large', budget: 5000000 },
        recommendedApproach: 'Approach C',
        relevanceScore: 80.0,
      },
    ];

    const newCaseConditions = {
      industry: 'Finance',
      companySize: 'large',
      purchaseBudget: 5000000,
      decisionMakerCount: 3,
    };

    const thresholdScore = 75.0;

    const result = findSimilarPatterns(
      newCaseConditions,
      referencePatterns,
      mockAIEngine,
      thresholdScore
    );

    expect(result).toHaveLength(3);
    expect(result[0].relevanceScore).toBe(80.0);
    expect(result[1].relevanceScore).toBe(75.0);
    expect(result[2].relevanceScore).toBe(70.0);

    const thresholdPatternIndex = result.findIndex(
      (p) => p.relevanceScore === 75.0
    );
    expect(thresholdPatternIndex).not.toBe(-1);

    const thresholdPattern = result[thresholdPatternIndex];
    expect(thresholdPattern.id).toBe('pattern_75');
    expect(thresholdPattern.pastDealId).toBe('deal_002');
    expect(thresholdPattern.customerInfo).toEqual({
      industry: 'Finance',
      size: 'large',
      budget: 5000000,
    });
    expect(thresholdPattern.recommendedApproach).toBe('Approach B');
    expect(thresholdPattern.relevanceScore).toBe(75.0);

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].relevanceScore).toBeGreaterThanOrEqual(
        result[i + 1].relevanceScore
      );
    }
  });
});