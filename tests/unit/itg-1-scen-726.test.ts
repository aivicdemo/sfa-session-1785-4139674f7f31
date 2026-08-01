import { updateSuccessPatternGuidelineCompletionStatus } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-726
  test("[normal] 成功パターン適用ガイドラインの周知完了判定機能 - 提出を行った営業担当者が複数件のときチーム全体の周知完了判定が実行される", () => {
    const team_id = "TEAM-A";
    const guideline_id = "GUIDELINE-001";
    const staff_a_id = "STAFF-001";
    const staff_b_id = "STAFF-002";
    const staff_c_id = "STAFF-003";

    const sales_staff_list = [
      {
        sales_staff_id: staff_a_id,
        team_id: team_id,
        name: "担当者1",
      },
      {
        sales_staff_id: staff_b_id,
        team_id: team_id,
        name: "担当者2",
      },
      {
        sales_staff_id: staff_c_id,
        team_id: team_id,
        name: "担当者3",
      },
    ];

    const guideline = {
      guideline_id: guideline_id,
      team_id: team_id,
      status: "生成完了",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    };

    const acknowledgement_records = [
      {
        record_id: "ACK-001",
        guideline_id: guideline_id,
        sales_staff_id: staff_a_id,
        acknowledged_at: "2024-01-15T11:00:00Z",
        status: "周知完了",
      },
      {
        record_id: "ACK-002",
        guideline_id: guideline_id,
        sales_staff_id: staff_b_id,
        acknowledged_at: "2024-01-15T11:30:00Z",
        status: "周知完了",
      },
    ];

    const result = updateSuccessPatternGuidelineCompletionStatus(
      guideline_id,
      team_id,
      sales_staff_list,
      acknowledgement_records
    );

    expect(result.guideline_id).toBe(guideline_id);
    expect(result.team_id).toBe(team_id);
    expect(result.completion_status).toBe("周知完了");
    expect(result.acknowledged_staff_count).toBe(2);
    expect(result.total_staff_count).toBe(3);
    expect(result.acknowledged_staff_ids).toEqual([staff_a_id, staff_b_id]);
    expect(result.acknowledged_at).toBe("2024-01-15T11:30:00Z");
    expect(typeof result.acknowledged_at).toBe("string");
  });
});