import { evaluateImprovementPriority } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 改善指導優先度決定', () => {
  // SCEN-2852
  test('乖離度が中程度で成約実績との相関が中程度の場合、優先度が中程度に設定される', () => {
    const salesPersonDeviationScore = 55;
    const correlationWithAcquisitionScore = 58;
    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.57),
    };

    const result = evaluateImprovementPriority(
      {
        deviationScore: salesPersonDeviationScore,
        correlationScore: correlationWithAcquisitionScore,
      },
      aiEngineStub
    );

    expect(result.priorityScore).toBeGreaterThanOrEqual(40);
    expect(result.priorityScore).toBeLessThanOrEqual(60);
    expect(result.priorityRank).toBe('MEDIUM');
  });
});