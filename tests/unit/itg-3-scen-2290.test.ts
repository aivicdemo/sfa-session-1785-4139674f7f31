import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターン照合・マッチング機能', () => {
  // SCEN-2290
  test('適用可能性スコアが0のパターンは推奨候補から除外される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern) => {
        if (pattern.id === 'pattern-a') {
          return { score: 0.8 };
        } else if (pattern.id === 'pattern-b') {
          return { score: 0 };
        } else if (pattern.id === 'pattern-c') {
          return { score: 0.6 };
        }
        return { score: 0 };
      })
    };

    const recommendationPatterns = [
      {
        id: 'pattern-a',
        name: 'パターンA',
        customerIndustry: 'IT',
        budgetRange: 'high',
        decisionMakers: 3,
        successRate: 0.85
      },
      {
        id: 'pattern-b',
        name: 'パターンB',
        customerIndustry: 'Finance',
        budgetRange: 'medium',
        decisionMakers: 2,
        successRate: 0.72
      },
      {
        id: 'pattern-c',
        name: 'パターンC',
        customerIndustry: 'Manufacturing',
        budgetRange: 'high',
        decisionMakers: 4,
        successRate: 0.78
      }
    ];

    const dealConditions = {
      customerIndustry: 'IT',
      budgetRange: 'high',
      decisionMakers: 3,
      purchaseTimeline: 'Q2'
    };

    const recommendations = generateRecommendation(
      dealConditions,
      recommendationPatterns,
      mockAIEngine
    );

    const recommendedPatternIds = recommendations.map((rec) => rec.patternId);

    expect(recommendedPatternIds).toContain('pattern-a');
    expect(recommendedPatternIds).toContain('pattern-c');
    expect(recommendedPatternIds).not.toContain('pattern-b');
    expect(recommendations.length).toBe(2);
  });
});