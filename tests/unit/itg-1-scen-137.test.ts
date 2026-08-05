import { validatePreInferenceDataQuality } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論実行前データ品質検証機能", () => {
  // SCEN-137
  test("データ品質が良好だが学習データが最小要件未満のとき推論実行が保留される", () => {
    const input = {
      completeness_percentage: 97,
      accuracy_percentage: 99,
      training_data_record_count: 5000,
      completeness_pass_threshold: 95,
      accuracy_pass_threshold: 98,
      training_data_minimum_requirement: 10000,
    };

    const result = validatePreInferenceDataQuality(input);

    expect(result.inference_execution_status).toBe("PENDING");
    expect(result.reason_message).toContain("5000");
    expect(result.reason_message).toContain("10000");
    expect(result.should_execute_inference).toBe(false);
  });
});