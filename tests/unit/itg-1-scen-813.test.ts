import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-813
  test("営業活動の実行時刻がステップ順序と逆序で記録されている場合、正しく順序付けして乖離度を計算する", () => {
    const sales_rep_id = "SR001";
    const analysis_period_start = "2024-01-01";
    const analysis_period_end = "2024-01-31";

    const activity_records = [
      {
        activity_id: "ACT003",
        sales_rep_id: sales_rep_id,
        activity_type: "initial_contact",
        executed_at: "2024-01-15T14:30:00Z",
        step_sequence: 1,
      },
      {
        activity_id: "ACT002",
        sales_rep_id: sales_rep_id,
        activity_type: "proposal",
        executed_at: "2024-01-15T14:15:00Z",
        step_sequence: 2,
      },
      {
        activity_id: "ACT001",
        sales_rep_id: sales_rep_id,
        activity_type: "negotiation",
        executed_at: "2024-01-15T14:00:00Z",
        step_sequence: 3,
      },
    ];

    const standard_process_steps = [
      { step_id: 1, step_name: "initial_contact", expected_order: 1 },
      { step_id: 2, step_name: "proposal", expected_order: 2 },
      { step_id: 3, step_name: "negotiation", expected_order: 3 },
    ];

    const result = generateSalesActivityPatternAnalysisReport({
      sales_rep_id,
      analysis_period_start,
      analysis_period_end,
      activity_records,
      standard_process_steps,
    });

    expect(result).toHaveProperty("reordered_activities");
    expect(result.reordered_activities).toHaveLength(3);

    expect(result.reordered_activities[0].activity_id).toBe("ACT001");
    expect(result.reordered_activities[0].executed_at).toBe(
      "2024-01-15T14:00:00Z"
    );
    expect(result.reordered_activities[0].step_sequence).toBe(1);

    expect(result.reordered_activities[1].activity_id).toBe("ACT002");
    expect(result.reordered_activities[1].executed_at).toBe(
      "2024-01-15T14:15:00Z"
    );
    expect(result.reordered_activities[1].step_sequence).toBe(2);

    expect(result.reordered_activities[2].activity_id).toBe("ACT003");
    expect(result.reordered_activities[2].executed_at).toBe(
      "2024-01-15T14:30:00Z"
    );
    expect(result.reordered_activities[2].step_sequence).toBe(3);

    expect(result).toHaveProperty("deviation_score");
    expect(typeof result.deviation_score).toBe("number");
    expect(result.deviation_score).toBeGreaterThanOrEqual(0);
  });
});