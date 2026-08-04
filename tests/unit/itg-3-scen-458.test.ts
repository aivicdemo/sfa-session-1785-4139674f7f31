import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculatePrioritizationScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度スコアリング機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-458
  test('影響度がちょうど閾値の場合、優先度スコアに正しく反映される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.5),
    };

    const scoringParams = {
      impactScore: 0.5,
      urgencyScore: 0.6,
      implementationDifficultyScore: 0.4,
      customerSatisfactionScore: 0.7,
    };

    const expectedPriorityScore =
      scoringParams.impactScore * 0.4 +
      scoringParams.urgencyScore * 0.3 +
      scoringParams.customerSatisfactionScore * 0.2 +
      (1 - scoringParams.implementationDifficultyScore) * 0.1;

    const result = calculatePrioritizationScore(scoringParams, mockAIEngine);

    expect(result.priorityScore).toBe(0.59);
    expect(result.priorityLevel).toBe('high');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});