import { calculateImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目の算出機能', () => {
  test('SCEN-496: ルール違反の重要度区分が null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Follow-up with 1-week gap',
        confidenceScore: 85,
        rationale: 'Similar success pattern detected',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          matchScore: 0.92,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'Based on customer profile and historical data'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.88),
    };

    const ruleViolationWithNullSeverity = {
      ruleId: 'RULE-001',
      violationType: 'Missing customer segmentation',
      severity: null,
      affectedRecords: 45,
      detectedAt: new Date('2024-01-15T10:30:00Z'),
    };

    expect(() =>
      calculateImprovementTargets(
        [ruleViolationWithNullSeverity],
        mockAIRecommendationEngine
      )
    ).toThrow(/重要度区分|severity|required/);
  });
});