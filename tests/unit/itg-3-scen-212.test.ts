import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-212: 根拠情報の信頼度スコアが表示閾値と一致する場合、根拠が可視化される', () => {
    // Arrange
    const TRUST_SCORE_THRESHOLD = 0.6;
    const TRUST_SCORE_RESULT = 0.6;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        proposedApproach: '生産効率化ソリューション導入',
        trustScore: TRUST_SCORE_RESULT,
        reasoning: {
          score: TRUST_SCORE_RESULT,
          description: '過去の類似案件で成功率85%を記録した成功パターンに合致',
          referencedSuccessPattern: {
            patternId: 'PATTERN-2024-001',
            caseName: '大手製造業A社 生産効率化案件',
            matchingFactors: [
              { factor: '業種', match: '製造業' },
              { factor: '課題', match: '生産効率化' },
              { factor: '予算帯', match: '500万円' }
            ]
          }
        }
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: TRUST_SCORE_RESULT,
        isApplicable: true
      })
    };

    const customerInput = {
      industry: '製造業',
      budget: 5000000,
      businessChallenge: '生産効率化'
    };

    // Act
    const result = generateRecommendation(
      customerInput,
      mockAIRecommendationEngine,
      TRUST_SCORE_THRESHOLD
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.recommendationId).toBe('REC-001');
    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.score).toBe(TRUST_SCORE_RESULT);
    expect(result.reasoning.description).toContain('生産効率化');
    expect(result.reasoning.referencedSuccessPattern).toBeDefined();
    expect(result.reasoning.referencedSuccessPattern.caseName).toBe('大手製造業A社 生産効率化案件');
    expect(result.reasoning.referencedSuccessPattern.matchingFactors).toHaveLength(3);
    expect(result.reasoning.referencedSuccessPattern.matchingFactors[0]).toEqual({
      factor: '業種',
      match: '製造業'
    });

    // Verify that the trust score equals the threshold (0.6 = 0.6)
    expect(result.reasoning.score).toBe(TRUST_SCORE_THRESHOLD);

    // Verify that reasoning visibility condition is satisfied
    // (score >= threshold means the reasoning should be visible)
    expect(result.reasoning.score >= TRUST_SCORE_THRESHOLD).toBe(true);

    // Verify that all required fields for UI rendering are present
    expect(result.reasoning.description).toBeTruthy();
    expect(result.reasoning.referencedSuccessPattern.patternId).toBeTruthy();
    expect(result.reasoning.referencedSuccessPattern.matchingFactors.length).toBeGreaterThan(0);
  });
});