import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-2379
  test('複数の成功パターンから統計的に有意な信頼度スコアが算出される', () => {
    const mockPatterns = [
      {
        patternId: 'pattern_001',
        relevanceScore: 0.85,
        appliedCasesCount: 24,
        successRate: 0.92,
      },
      {
        patternId: 'pattern_002',
        relevanceScore: 0.78,
        appliedCasesCount: 18,
        successRate: 0.88,
      },
      {
        patternId: 'pattern_003',
        relevanceScore: 0.72,
        appliedCasesCount: 15,
        successRate: 0.85,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newProjectData = {
      customerIndustry: 'software',
      dealStage: 'proposal',
      challengeContent: 'digital transformation',
    };

    const result = evaluatePatternRelevance(
      newProjectData,
      mockPatterns,
      mockAIEngine
    );

    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1.0);
    expect(result.usedPatternsCount).toBeGreaterThanOrEqual(3);
    expect(result.usedPatternsCount).toBe(3);
    expect(result.confidenceInterval).toBeDefined();
    expect(result.confidenceInterval.lower).toBeGreaterThanOrEqual(0.0);
    expect(result.confidenceInterval.upper).toBeLessThanOrEqual(1.0);
    expect(result.confidenceInterval.level).toBe(0.95);
    expect(result.calculationBasis).toBe(
      '複数パターンの統計的集約'
    );
    expect(result.confidenceLevel).toBe('High');
    expect(result.scoringLog).toContain(
      '複数パターン統計集約による有意性確認済み'
    );

    const expectedScore =
      (0.85 * 24 * 0.92 + 0.78 * 18 * 0.88 + 0.72 * 15 * 0.85) /
      (24 * 0.92 + 18 * 0.88 + 15 * 0.85);
    expect(result.confidenceScore).toBeCloseTo(expectedScore, 2);
  });
});