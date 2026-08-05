import { calculateInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-736
  test("[normal] AIエージェント推論精度評価機能 - 問題検出結果が1件の状態での推論精度が適切に算出される", () => {
    const problem_detection_results = [
      {
        detection_id: "detect_001",
        sales_activity_id: "activity_001",
        detected_issue_type: "process_deviation",
        confidence_score: 100.0,
        detected_at: new Date("2024-01-15T11:00:00Z").toISOString(),
        is_valid: true,
      },
    ];

    const inference_accuracy = calculateInferenceAccuracy(
      problem_detection_results
    );

    expect(inference_accuracy).toBe(100.0);
  });
});