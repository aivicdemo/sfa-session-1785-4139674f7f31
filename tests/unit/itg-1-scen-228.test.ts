import { describe, test, expect, beforeEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-228
  test("標準プロセス遵守度スコア計算機能 - 商談記録の顧客IDが空文字列のときエラーになる", async () => {
    const { calculateStandardProcessComplianceScore } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const invalid_input_customer_id_empty = {
      deal_record_id: "DR-20240115-001",
      customer_id: "",
      sales_stage: "proposal",
      execution_datetime: "2024-01-15T10:30:00Z",
      process_definition_id: "PD-STD-001",
      standard_steps: [
        {
          step_id: "step_1",
          step_name: "初回接触",
          expected_duration_days: 3,
        },
        {
          step_id: "step_2",
          step_name: "提案",
          expected_duration_days: 7,
        },
        {
          step_id: "step_3",
          step_name: "交渉",
          expected_duration_days: 5,
        },
      ],
      actual_steps: [
        {
          step_id: "step_1",
          completed_datetime: "2024-01-10T09:00:00Z",
        },
        {
          step_id: "step_2",
          completed_datetime: "2024-01-15T10:30:00Z",
        },
      ],
    };

    expect(() =>
      calculateStandardProcessComplianceScore(invalid_input_customer_id_empty)
    ).toThrow(/顧客ID/);
  });
});