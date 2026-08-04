import { calculateImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目の算出機能', () => {
  test('SCEN-496: ルール違反の重要度区分が null のとき、エラーが発生する', () => {
    const ruleViolation = {
      ruleId: 'RULE-001',
      violationType: 'data_quality',
      severity: null as unknown as string,
      description: 'Customer data incomplete',
      detectedAt: new Date('2024-01-15T10:00:00Z'),
      affectedRecords: 150,
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'APP-001',
        recommendedActions: ['Action 1', 'Action 2'],
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('Sample reasoning'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.9),
    };

    expect(() => calculateImprovementItems(ruleViolation, aiRecommendationEngineStub)).toThrow(
      /severity/i,
    );
  });
});