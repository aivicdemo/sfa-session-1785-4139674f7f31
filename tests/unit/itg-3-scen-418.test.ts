import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-418
  test('スコアが閾値直下の場合、正しい改善優先度ランクが付与される', () => {
    const THRESHOLD = 70;
    const SCORE_JUST_BELOW_THRESHOLD = 69.5;
    const EXPECTED_PRIORITY_RANK_VALUE = 1;
    const EXPECTED_PRIORITY_RANK_NAME = 'HIGH';
    const EXPECTED_RANK_REASON_KEYWORD = 'スコアが閾値未満のため改善が必要';
    const CURRENT_TIME = new Date('2024-01-15T11:00:00Z');
    const TIME_TOLERANCE_SECONDS = 5;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(SCORE_JUST_BELOW_THRESHOLD),
    };

    const dealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      dealSize: 5000000,
      dealStage: 'proposal',
      qualityScore: null,
      priorityRank: null,
      rankAssignedAt: null,
      rankReason: null,
    };

    const result = calculateDataQualityScore(
      dealData,
      THRESHOLD,
      mockAIEngine,
      CURRENT_TIME
    );

    expect(result.qualityScore).toBe(SCORE_JUST_BELOW_THRESHOLD);
    expect(result.priorityRank).toBe(EXPECTED_PRIORITY_RANK_VALUE);
    expect(result.priorityRankName).toBe(EXPECTED_PRIORITY_RANK_NAME);
    expect(result.rankReason).toMatch(new RegExp(EXPECTED_RANK_REASON_KEYWORD));

    const assignedTimestamp = new Date(result.rankAssignedAt);
    const timeDifferenceSeconds = Math.abs(
      (assignedTimestamp.getTime() - CURRENT_TIME.getTime()) / 1000
    );
    expect(timeDifferenceSeconds).toBeLessThanOrEqual(TIME_TOLERANCE_SECONDS);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealData);
  });
});