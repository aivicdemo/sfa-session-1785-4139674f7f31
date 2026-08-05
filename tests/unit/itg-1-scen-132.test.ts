import { executeAiInferenceWithQualityGate } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-132: [error] AIエージェント推論実行前データ品質検証機能 - 品質検証ステータスが「未完了」のとき推論実行が保留される
  test("品質検証ステータスが未完了のとき推論実行が保留される", () => {
    const inference_request = {
      inference_id: "inf_20240115_001",
      business_rule_id: "br_2_1_1_1",
      target_period_start: "2024-01-01T00:00:00Z",
      target_period_end: "2024-01-31T23:59:59Z",
      sales_person_ids: ["sp_001", "sp_002", "sp_003"],
      min_training_data_records: 100,
      data_quality_validation_status: "incomplete",
      data_quality_score: 0,
      data_quality_completion_date: null,
    };

    expect(() =>
      executeAiInferenceWithQualityGate(inference_request)
    ).toThrow(/品質検証/);
  });
});