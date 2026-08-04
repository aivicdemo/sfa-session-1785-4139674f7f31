import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - 適合度閾値判定', () => {
  // SCEN-1286
  test('適合度74.9%のパターンが75.0%閾値未満として除外される', () => {
    const RELEVANCE_THRESHOLD = 75.0;
    const BELOW_THRESHOLD_SCORE = 74.9;
    const ABOVE_THRESHOLD_SCORE = 80.0;

    const newDealCondition = {
      customerIndustry: 'IT',
      companySize: 'mid-market',
      budget: 5000000,
      businessChallenge: 'デジタル変革',
    };

    const successPatterns = [
      {
        patternId: 'pattern_001',
        customerIndustry: 'IT',
        companySize: 'mid-market',
        budget: 4500000,
        businessChallenge: 'デジタル変革',
      },
      {
        patternId: 'pattern_002',
        customerIndustry: 'IT',
        companySize: 'enterprise',
        budget: 8000000,
        businessChallenge: 'デジタル変革',
      },
    ];

    const evaluatedPatterns = successPatterns.map((pattern, index) => ({
      patternId: pattern.patternId,
      relevanceScore: index === 0 ? BELOW_THRESHOLD_SCORE : ABOVE_THRESHOLD_SCORE,
      matchDetails: pattern,
    }));

    const result = evaluatePatternRelevance(
      newDealCondition,
      evaluatedPatterns,
      RELEVANCE_THRESHOLD
    );

    expect(result.applicablePatterns).toHaveLength(1);
    expect(result.applicablePatterns[0].patternId).toBe('pattern_002');
    expect(result.applicablePatterns[0].relevanceScore).toBe(ABOVE_THRESHOLD_SCORE);

    expect(result.excludedPatterns).toHaveLength(1);
    expect(result.excludedPatterns[0].patternId).toBe('pattern_001');
    expect(result.excludedPatterns[0].relevanceScore).toBe(BELOW_THRESHOLD_SCORE);
    expect(result.excludedPatterns[0].exclusionReason).toMatch(/75\.0/);

    expect(result.processingLog).toContain('pattern_001');
    expect(result.processingLog).toMatch(/74\.9/);
    expect(result.processingLog).toMatch(/75\.0/);
    expect(result.processingLog).toMatch(/除外/);
  });
});