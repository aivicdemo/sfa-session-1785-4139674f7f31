import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-489
  test("AIエージェント推論精度スコア算出機能 - 推論結果がすべて誤った場合、精度スコアが0で算出される", () => {
    const test_dataset = [
      {
        inference_id: "inf_001",
        expected_result: "true",
        actual_result: "false",
        accuracy: false,
      },
      {
        inference_id: "inf_002",
        expected_result: "approved",
        actual_result: "rejected",
        accuracy: false,
      },
      {
        inference_id: "inf_003",
        expected_result: 100,
        actual_result: 50,
        accuracy: false,
      },
      {
        inference_id: "inf_004",
        expected_result: "high_priority",
        actual_result: "low_priority",
        accuracy: false,
      },
      {
        inference_id: "inf_005",
        expected_result: "proceed",
        actual_result: "hold",
        accuracy: false,
      },
    ];

    const result = calculateInferenceAccuracyScore(test_dataset);

    expect(result.accuracy_score).toBe(0.0);
    expect(result.correct_count).toBe(0);
    expect(result.total_count).toBe(5);
    expect(result.calculation_log).toContain("正解数: 0 / 総件数: 5");
  });
});