import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度検証機能 - 統計ベース推奨の精度計測', () => {
  // SCEN-344
  test('推奨タイプがSTATISTICALの場合、統計ベースの計測方法が適用され、推奨パターンマスタから抽出した統計値を用いた精度値が返却される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        type: 'STATISTICAL',
        recommendedApproach: 'Follow-up engagement strategy',
        confidenceScore: 0,
        reasoning: 'Statistical analysis of similar patterns'
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.78)
    };

    const successPatternMasterData = [
      {
        patternId: 'SP-001',
        customerSegment: 'Enterprise',
        industryType: 'Technology',
        dealSize: 'Large',
        successRate: 0.85,
        occurrenceCount: 42,
        applicabilityScore: 0.82
      },
      {
        patternId: 'SP-002',
        customerSegment: 'Enterprise',
        industryType: 'Finance',
        dealSize: 'Medium',
        successRate: 0.79,
        occurrenceCount: 28,
        applicabilityScore: 0.76
      },
      {
        patternId: 'SP-003',
        customerSegment: 'MidMarket',
        industryType: 'Technology',
        dealSize: 'Medium',
        successRate: 0.72,
        occurrenceCount: 35,
        applicabilityScore: 0.68
      }
    ];

    const historicalRecommendationData = [
      {
        recommendationId: 'REC-001',
        patternIdApplied: 'SP-001',
        actualOutcome: 'Success',
        adoptionFlag: true
      },
      {
        recommendationId: 'REC-002',
        patternIdApplied: 'SP-001',
        actualOutcome: 'Success',
        adoptionFlag: true
      },
      {
        recommendationId: 'REC-003',
        patternIdApplied: 'SP-002',
        actualOutcome: 'Success',
        adoptionFlag: true
      },
      {
        recommendationId: 'REC-004',
        patternIdApplied: 'SP-001',
        actualOutcome: 'Failure',
        adoptionFlag: false
      },
      {
        recommendationId: 'REC-005',
        patternIdApplied: 'SP-003',
        actualOutcome: 'Success',
        adoptionFlag: true
      }
    ];

    const currentRecommendation = {
      type: 'STATISTICAL',
      customerSegment: 'Enterprise',
      industryType: 'Technology',
      dealSize: 'Large',
      matchedPatternIds: ['SP-001'],
      recommendedApproach: 'Follow-up engagement strategy'
    };

    const result = evaluateRecommendationAccuracy(
      currentRecommendation,
      successPatternMasterData,
      historicalRecommendationData,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.measurementMethod).toBe('STATISTICAL');
    expect(result.matchedPatternCount).toBe(1);
    expect(result.applicabilityScore).toBe(0.82);
    expect(result.historicalSuccessRate).toBe(0.75);
    expect(result.overallAccuracyScore).toBe(78);
    expect(result.statisticalIndicators).toEqual({
      totalMatchedPatterns: 1,
      weightedSuccessRate: 0.75,
      patternOccurrenceWeight: 0.42,
      confidenceLevel: 'High'
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'SP-001',
        recommendationType: 'STATISTICAL'
      })
    );
  });
});