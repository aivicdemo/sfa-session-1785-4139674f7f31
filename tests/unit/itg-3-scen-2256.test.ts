import { analyzeCustomerApproachDeviation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2256
  test("[normal] 異常パターン検出ロジック - 顧客対応パターンが標準プロセスから軽微に逸脱しているとき注意レベルで検出される", () => {
    const standard_process_steps = [
      {
        step_id: "step_1",
        step_name: "提案資料説明",
        standard_duration_minutes: 20,
        standard_order: 1,
      },
      {
        step_id: "step_2",
        step_name: "顧客課題ヒアリング",
        standard_duration_minutes: 15,
        standard_order: 2,
      },
      {
        step_id: "step_3",
        step_name: "フォローアップ1回目",
        standard_duration_minutes: 0,
        standard_order: 3,
        standard_interval_days: 3,
      },
      {
        step_id: "step_4",
        step_name: "フォローアップ2回目",
        standard_duration_minutes: 0,
        standard_order: 4,
        standard_interval_days: 7,
      },
    ];

    const current_customer_approach = {
      customer_id: "CUST_001",
      sequence_of_steps: [
        {
          step_id: "step_2",
          step_name: "顧客課題ヒアリング",
          actual_order: 1,
          actual_duration_minutes: 16,
          completed_at: new Date("2024-01-15T10:00:00Z"),
        },
        {
          step_id: "step_1",
          step_name: "提案資料説明",
          actual_order: 2,
          actual_duration_minutes: 21,
          completed_at: new Date("2024-01-15T10:20:00Z"),
        },
        {
          step_id: "step_3",
          step_name: "フォローアップ1回目",
          actual_order: 3,
          completed_at: new Date("2024-01-18T14:30:00Z"),
        },
        {
          step_id: "step_4",
          step_name: "フォローアップ2回目",
          actual_order: 4,
          completed_at: new Date("2024-01-25T09:00:00Z"),
        },
      ],
      initial_contact_date: new Date("2024-01-15T10:00:00Z"),
    };

    const result = analyzeCustomerApproachDeviation(
      current_customer_approach,
      standard_process_steps
    );

    expect(result.severity_level).toBe("WARNING");
    expect(result.deviation_score).toBeGreaterThanOrEqual(0.25);
    expect(result.deviation_score).toBeLessThanOrEqual(0.45);
    expect(result.critical).toBe(false);
    expect(result.deviation_reason).toContain("提案資料");
    expect(result.deviation_reason).toContain("順序");
    expect(result.customer_id).toBe("CUST_001");
    expect(typeof result.deviation_reason).toBe("string");
    expect(result.deviation_reason.length).toBeGreaterThan(0);
  });
});