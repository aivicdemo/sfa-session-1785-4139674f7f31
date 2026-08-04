import { describe, test, expect, beforeEach } from '@jest/globals';
import { matchMultipleConditions } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 複数商談条件の照合', () => {
  let aiRecommendationEngineMock: {
    findSimilarPatterns: jest.Mock;
  };

  beforeEach(() => {
    aiRecommendationEngineMock = {
      findSimilarPatterns: jest.fn(),
    };
  });

  // SCEN-902
  test('複数の商談条件が入力されたとき各条件のマッチスコアが正確に算出され統合スコアで降順ランク付けされる', () => {
    const dealConditions = [
      {
        conditionId: 'cond_001',
        customerIndustry: '製造業',
        weight: 0.4,
      },
      {
        conditionId: 'cond_002',
        dealAmount: 5000000,
        weight: 0.35,
      },
      {
        conditionId: 'cond_003',
        decisionMakers: 3,
        weight: 0.25,
      },
    ];

    const successPatternsFromEngine = [
      {
        patternId: 'pattern_alpha',
        customerIndustryMatch: 0.95,
        dealAmountMatch: 0.85,
        decisionMakersMatch: 0.80,
        cumulativeScore: 0.0,
      },
      {
        patternId: 'pattern_beta',
        customerIndustryMatch: 0.70,
        dealAmountMatch: 0.92,
        decisionMakersMatch: 0.88,
        cumulativeScore: 0.0,
      },
      {
        patternId: 'pattern_gamma',
        customerIndustryMatch: 0.65,
        dealAmountMatch: 0.60,
        decisionMakersMatch: 0.75,
        cumulativeScore: 0.0,
      },
    ];

    aiRecommendationEngineMock.findSimilarPatterns.mockReturnValue(
      successPatternsFromEngine
    );

    const result = matchMultipleConditions(
      dealConditions,
      aiRecommendationEngineMock
    );

    const expectedAlphaScore =
      0.95 * 0.4 + 0.85 * 0.35 + 0.80 * 0.25;
    const expectedBetaScore =
      0.70 * 0.4 + 0.92 * 0.35 + 0.88 * 0.25;
    const expectedGammaScore =
      0.65 * 0.4 + 0.60 * 0.35 + 0.75 * 0.25;

    expect(result.matchResults).toHaveLength(3);

    expect(result.matchResults[0]).toEqual(
      expect.objectContaining({
        patternId: 'pattern_alpha',
        individualScores: expect.objectContaining({
          customerIndustryMatch: 0.95,
          dealAmountMatch: 0.85,
          decisionMakersMatch: 0.80,
        }),
        weightedScore: Math.round(expectedAlphaScore * 100) / 100,
      })
    );

    expect(result.matchResults[1]).toEqual(
      expect.objectContaining({
        patternId: 'pattern_beta',
        individualScores: expect.objectContaining({
          customerIndustryMatch: 0.70,
          dealAmountMatch: 0.92,
          decisionMakersMatch: 0.88,
        }),
        weightedScore: Math.round(expectedBetaScore * 100) / 100,
      })
    );

    expect(result.matchResults[2]).toEqual(
      expect.objectContaining({
        patternId: 'pattern_gamma',
        individualScores: expect.objectContaining({
          customerIndustryMatch: 0.65,
          dealAmountMatch: 0.60,
          decisionMakersMatch: 0.75,
        }),
        weightedScore: Math.round(expectedGammaScore * 100) / 100,
      })
    );

    expect(result.matchResults[0].weightedScore).toBeGreaterThan(
      result.matchResults[1].weightedScore
    );
    expect(result.matchResults[1].weightedScore).toBeGreaterThan(
      result.matchResults[2].weightedScore
    );

    expect(
      result.matchResults.every(
        (r) =>
          r.individualScores.customerIndustryMatch >= 0.0 &&
          r.individualScores.customerIndustryMatch <= 1.0 &&
          r.individualScores.dealAmountMatch >= 0.0 &&
          r.individualScores.dealAmountMatch <= 1.0 &&
          r.individualScores.decisionMakersMatch >= 0.0 &&
          r.individualScores.decisionMakersMatch <= 1.0
      )
    ).toBe(true);

    expect(aiRecommendationEngineMock.findSimilarPatterns).toHaveBeenCalledTimes(
      1
    );
    expect(
      aiRecommendationEngineMock.findSimilarPatterns
    ).toHaveBeenCalledWith(dealConditions);

    expect(result.processedConditionCount).toBe(3);
    expect(result.matchResults.length).toBe(
      successPatternsFromEngine.length
    );
  });
});