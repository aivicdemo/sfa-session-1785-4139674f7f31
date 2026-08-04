import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・マッチング機能', () => {
  // SCEN-267
  test('現在の商談条件に類似した過去事例の類似度スコアが適用閾値直下のとき、該当パターンが不採用になる', () => {
    const threshold = 0.75;

    const similarPatternsMap = {
      patternA: { score: 0.74, id: 'patternA', name: '成功パターンA', description: 'IT業界向け導入パターン' },
      patternB: { score: 0.76, id: 'patternB', name: '成功パターンB', description: 'IT業界向け拡張パターン' },
      patternC: { score: 0.65, id: 'patternC', name: '成功パターンC', description: '異業種向けパターン' },
    };

    const mockFindSimilarPatterns = jest.fn((dealConditions: any) => {
      return Object.values(similarPatternsMap).map(pattern => ({
        patternId: pattern.id,
        patternName: pattern.name,
        description: pattern.description,
        similarityScore: pattern.score,
      }));
    });

    const mockEvaluatePatternRelevance = jest.fn((patternId: string) => {
      const pattern = Object.values(similarPatternsMap).find(p => p.id === patternId);
      return {
        patternId: patternId,
        relevanceScore: pattern?.score ?? 0,
        isApplicable: (pattern?.score ?? 0) >= threshold,
      };
    });

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const dealConditions = {
      customerIndustry: 'IT',
      budgetSize: 5000000,
      implementationPeriodMonths: 3,
    };

    const result = generateRecommendation(
      dealConditions,
      mockAIRecommendationEngine
    );

    const recommendedPatternIds = result.map((rec: any) => rec.patternId);

    expect(recommendedPatternIds).not.toContain('patternA');
    expect(recommendedPatternIds).toContain('patternB');
    expect(recommendedPatternIds).not.toContain('patternC');

    const patternAEvaluation = mockEvaluatePatternRelevance('patternA');
    expect(patternAEvaluation.relevanceScore).toBe(0.74);
    expect(patternAEvaluation.isApplicable).toBe(false);

    const patternBEvaluation = mockEvaluatePatternRelevance('patternB');
    expect(patternBEvaluation.relevanceScore).toBe(0.76);
    expect(patternBEvaluation.isApplicable).toBe(true);

    const patternCEvaluation = mockEvaluatePatternRelevance('patternC');
    expect(patternCEvaluation.relevanceScore).toBe(0.65);
    expect(patternCEvaluation.isApplicable).toBe(false);
  });
});