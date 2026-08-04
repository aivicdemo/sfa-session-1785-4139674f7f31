import { calculateImprovementPriorityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度スコアリング", () => {
  test("SCEN-460: 影響度が閾値直上の場合、優先度スコアに正しく反映される", () => {
    const IMPACT_THRESHOLD = 70;
    const IMPACT_JUST_ABOVE_THRESHOLD = 71;
    const IMPACT_BELOW_THRESHOLD = 70;
    const IMPACT_ABOVE_THRESHOLD = 75;

    // 標準値の設定
    const BASE_URGENCY_SCORE = 50;
    const BASE_RELEVANCE_SCORE = 60;

    // 閾値以下の影響度でのスコアリング
    const scoreBelowThreshold = calculateImprovementPriorityScore({
      impactScore: IMPACT_BELOW_THRESHOLD,
      urgencyScore: BASE_URGENCY_SCORE,
      relevanceScore: BASE_RELEVANCE_SCORE,
    });

    // 閾値直上の影響度でのスコアリング
    const scoreJustAboveThreshold = calculateImprovementPriorityScore({
      impactScore: IMPACT_JUST_ABOVE_THRESHOLD,
      urgencyScore: BASE_URGENCY_SCORE,
      relevanceScore: BASE_RELEVANCE_SCORE,
    });

    // 閾値からさらに上の影響度でのスコアリング
    const scoreAboveThreshold = calculateImprovementPriorityScore({
      impactScore: IMPACT_ABOVE_THRESHOLD,
      urgencyScore: BASE_URGENCY_SCORE,
      relevanceScore: BASE_RELEVANCE_SCORE,
    });

    // 期待値の計算
    // 設計仕様では影響度70での優先度スコアが65.0
    const expectedScoreBelowThreshold = 65.0;

    // 影響度71での優先度スコアは66.5以上67.0以下の範囲
    const expectedScoreJustAboveThresholdMin = 66.5;
    const expectedScoreJustAboveThresholdMax = 67.0;

    // 影響度が71の場合、優先度スコアが閾値以下の場合から増加していることを検証
    expect(scoreBelowThreshold).toBe(expectedScoreBelowThreshold);
    expect(scoreJustAboveThreshold).toBeGreaterThanOrEqual(
      expectedScoreJustAboveThresholdMin
    );
    expect(scoreJustAboveThreshold).toBeLessThanOrEqual(
      expectedScoreJustAboveThresholdMax
    );

    // 影響度71での優先度スコアが影響度70での優先度スコアよりも大きいことを検証
    expect(scoreJustAboveThreshold).toBeGreaterThan(scoreBelowThreshold);

    // 影響度75での優先度スコアが影響度71での優先度スコアよりも大きいことを検証
    expect(scoreAboveThreshold).toBeGreaterThan(scoreJustAboveThreshold);

    // スコアが単調増加していることを確認
    expect(scoreBelowThreshold).toBeLessThan(scoreJustAboveThreshold);
    expect(scoreJustAboveThreshold).toBeLessThan(scoreAboveThreshold);

    // 影響度が1ポイント増えることによる優先度スコアの増分が1.5ポイント以上であることを検証
    const incrementFromBelowToJustAbove =
      scoreJustAboveThreshold - scoreBelowThreshold;
    expect(incrementFromBelowToJustAbove).toBeGreaterThanOrEqual(1.5);
  });
});