import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/itg-3';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨支援システム - 改善優先度スコアリング機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-460
  test('影響度が閾値直上の場合、優先度スコアに正しく反映される', async () => {
    const IMPACT_THRESHOLD = 70;
    const IMPACT_AT_THRESHOLD = 71;
    const IMPACT_BELOW_THRESHOLD = 70;
    const IMPACT_COMPARISON_VALUE = 75;

    const STANDARD_URGENCY = 50;
    const STANDARD_RELEVANCE = 60;

    const EXPECTED_SCORE_BELOW_THRESHOLD = 65.0;
    const EXPECTED_SCORE_AT_THRESHOLD_LOWER_BOUND = 66.5;
    const EXPECTED_SCORE_AT_THRESHOLD_UPPER_BOUND = 67.0;
    const MINIMUM_SCORE_INCREMENT = 1.5;

    const aiEngineStub = {
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValueOnce({ relevanceScore: STANDARD_RELEVANCE })
        .mockResolvedValueOnce({ relevanceScore: STANDARD_RELEVANCE })
        .mockResolvedValueOnce({ relevanceScore: STANDARD_RELEVANCE }),
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({ relevanceScore: STANDARD_RELEVANCE }),
      { status: 200 }
    );

    const priorityScoringInput = {
      improvementArea: 'sales_process_standardization',
      impactLevel: IMPACT_BELOW_THRESHOLD,
      urgencyScore: STANDARD_URGENCY,
      relevanceScore: STANDARD_RELEVANCE,
      thresholdValue: IMPACT_THRESHOLD,
    };

    const scoreAtThreshold = await calculateImprovementPriorityScore(
      {
        ...priorityScoringInput,
        impactLevel: IMPACT_AT_THRESHOLD,
      },
      aiEngineStub
    );

    const scoreComparison = await calculateImprovementPriorityScore(
      {
        ...priorityScoringInput,
        impactLevel: IMPACT_COMPARISON_VALUE,
      },
      aiEngineStub
    );

    expect(scoreAtThreshold).toBeGreaterThanOrEqual(
      EXPECTED_SCORE_AT_THRESHOLD_LOWER_BOUND
    );
    expect(scoreAtThreshold).toBeLessThanOrEqual(
      EXPECTED_SCORE_AT_THRESHOLD_UPPER_BOUND
    );

    const scoreDifference = scoreAtThreshold - EXPECTED_SCORE_BELOW_THRESHOLD;
    expect(scoreDifference).toBeGreaterThanOrEqual(MINIMUM_SCORE_INCREMENT);

    expect(scoreComparison).toBeGreaterThan(scoreAtThreshold);

    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        impactLevel: IMPACT_AT_THRESHOLD,
        thresholdValue: IMPACT_THRESHOLD,
      })
    );
  });
});