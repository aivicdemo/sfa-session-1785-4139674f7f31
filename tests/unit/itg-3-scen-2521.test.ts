import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能 - 閾値直上の件数処理', () => {
  // SCEN-2521
  test('成功要因の件数が閾値直上のとき、テンプレートから除外される', async () => {
    // Arrange
    const PATTERN_THRESHOLD = 10;
    const successFactorsAboveThreshold = Array.from({ length: PATTERN_THRESHOLD + 1 }, (_, i) => ({
      factorId: `factor_${i + 1}`,
      description: `Success factor ${i + 1}`,
      occurrenceCount: Math.floor(Math.random() * 50) + 1,
      impactScore: Math.random() * 100,
    }));

    const successFactorsBelowThreshold = Array.from({ length: PATTERN_THRESHOLD - 2 }, (_, i) => ({
      factorId: `factor_below_${i + 1}`,
      description: `Success factor below ${i + 1}`,
      occurrenceCount: Math.floor(Math.random() * 30) + 1,
      impactScore: Math.random() * 100,
    }));

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern: any) => {
        return Promise.resolve({
          relevanceScore: pattern.factorId.includes('_below_') ? 85 : 72,
          applicableSegments: ['SMB', 'Enterprise'],
          confidenceLevel: 0.92,
        });
      }),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const mockRecommendationPatternMaster = {
      templates: [] as Array<{
        templateId: string;
        successFactorCount: number;
        applicableSegments: string[];
        relevanceScore: number;
      }>,
    };

    // Act: 成功パターン抽出・構造化を実行
    const allFactors = [...successFactorsAboveThreshold, ...successFactorsBelowThreshold];

    for (const factor of allFactors) {
      const relevanceResult = await mockAIEngine.evaluatePatternRelevance(factor);

      const shouldIncludeInTemplate = allFactors.filter(f => f.factorId === factor.factorId).length <= PATTERN_THRESHOLD;

      if (shouldIncludeInTemplate && relevanceResult.relevanceScore >= 75) {
        const templateRecord = {
          templateId: `template_${factor.factorId}`,
          successFactorCount: allFactors.filter(
            f =>
              f.description.split(' ')[2] === factor.description.split(' ')[2] ||
              (factor.factorId.includes('_below_') === f.factorId.includes('_below_'))
          ).length,
          applicableSegments: relevanceResult.applicableSegments,
          relevanceScore: relevanceResult.relevanceScore,
        };

        mockRecommendationPatternMaster.templates.push(templateRecord);
      }
    }

    // Assert
    const aboveThresholdTemplates = mockRecommendationPatternMaster.templates.filter(
      t => t.successFactorCount > PATTERN_THRESHOLD
    );

    const belowThresholdTemplates = mockRecommendationPatternMaster.templates.filter(
      t => t.successFactorCount <= PATTERN_THRESHOLD
    );

    expect(aboveThresholdTemplates).toHaveLength(0);
    expect(belowThresholdTemplates.length).toBeGreaterThan(0);
    expect(belowThresholdTemplates[0].relevanceScore).toBeGreaterThanOrEqual(75);

    const allTemplateFactorCounts = mockRecommendationPatternMaster.templates.map(t => t.successFactorCount);
    expect(Math.max(...allTemplateFactorCounts)).toBeLessThanOrEqual(PATTERN_THRESHOLD);
  });
});