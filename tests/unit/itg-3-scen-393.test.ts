import { validateRecommendationAccuracyWithMissingReasoningData } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推論精度検証 - 推奨根拠欠落時の除外処理", () => {
  // SCEN-393
  test("推論根拠データが欠落している推奨履歴を精度計測から除外する", () => {
    const recommendationHistoryWithMissingData = [
      {
        recommendation_history_id: "rec_001",
        reasoning_data: {
          customer_attributes: { industry: "IT", scale: "large" },
          success_patterns: ["pattern_a", "pattern_b"],
          timing_factors: { optimal_month: 3, confidence: 0.92 },
        },
        accuracy_score: 85,
      },
      {
        recommendation_history_id: "rec_002",
        reasoning_data: {
          customer_attributes: { industry: "Finance", scale: "medium" },
          success_patterns: ["pattern_c"],
          timing_factors: { optimal_month: 6, confidence: 0.88 },
        },
        accuracy_score: 79,
      },
      {
        recommendation_history_id: "rec_003",
        reasoning_data: {
          customer_attributes: { industry: "Retail", scale: "small" },
          success_patterns: ["pattern_d", "pattern_e"],
          timing_factors: { optimal_month: 9, confidence: 0.91 },
        },
        accuracy_score: 88,
      },
      {
        recommendation_history_id: "rec_004",
        reasoning_data: null,
        accuracy_score: 72,
      },
      {
        recommendation_history_id: "rec_005",
        reasoning_data: "",
        accuracy_score: 68,
      },
    ];

    const result = validateRecommendationAccuracyWithMissingReasoningData(
      recommendationHistoryWithMissingData
    );

    expect(result.measurement_target_count).toBe(3);
    expect(result.excluded_count).toBe(2);
    expect(result.excluded_records).toHaveLength(2);
    expect(result.excluded_records[0].recommendation_history_id).toBe(
      "rec_004"
    );
    expect(result.excluded_records[0].exclusion_reason).toBe(
      "MISSING_REASONING_DATA"
    );
    expect(result.excluded_records[1].recommendation_history_id).toBe(
      "rec_005"
    );
    expect(result.excluded_records[1].exclusion_reason).toBe(
      "MISSING_REASONING_DATA"
    );

    const average_accuracy_score =
      (85 + 79 + 88) / 3;
    expect(result.average_accuracy_score).toBe(average_accuracy_score);
    expect(result.sample_count).toBe(3);
    expect(result.measurement_statistics.included_accuracy_scores).toEqual([
      85, 79, 88,
    ]);
    expect(result.measurement_statistics.included_accuracy_scores).not.toContain(
      72
    );
    expect(result.measurement_statistics.included_accuracy_scores).not.toContain(
      68
    );
  });
});