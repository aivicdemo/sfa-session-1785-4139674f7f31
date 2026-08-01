import { evaluateSuccessPatternGuidanceCompletionStatus } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-725: [edge] 成功パターン適用ガイドラインの周知完了判定機能 - 提出を行った営業担当者が1件のときチーム全体の周知完了判定が実行される
  test("should execute team-wide guidance completion evaluation when 1 of 3 sales staff submits, update evaluation target count to 1, mark completion status as incomplete, and show remaining 2 staff as pending", () => {
    // 初期状態: テスト対象チーム3名全員が提出完了状態に初期化
    const team_id = "team_001";
    const sales_staff_ids = ["staff_001", "staff_002", "staff_003"];
    const evaluation_target_count_before = 3;
    const submitted_staff_id = "staff_001";

    // 入力: 1名の営業担当者が適用ガイドラインの提出を実行
    const evaluation_input = {
      team_id: team_id,
      all_sales_staff_ids: sales_staff_ids,
      submitted_staff_id: submitted_staff_id,
      evaluation_target_count: evaluation_target_count_before,
    };

    // 周知完了判定機能の判定ロジックを実行
    const evaluation_result = evaluateSuccessPatternGuidanceCompletionStatus(
      evaluation_input
    );

    // 期待結果の検証
    // 1. 判定対象者数が3名から1名に更新される
    expect(evaluation_result.updated_evaluation_target_count).toBe(1);

    // 2. 周知完了判定の結果は『未完了』
    expect(evaluation_result.completion_status).toBe("incomplete");

    // 3. チーム全体が未完了と判定される
    expect(evaluation_result.team_completion_status).toBe("incomplete");

    // 4. 残り2名の提出待ち状態が表示される
    expect(evaluation_result.pending_staff_count).toBe(2);
    expect(evaluation_result.pending_staff_ids).toEqual([
      "staff_002",
      "staff_003",
    ]);

    // 5. 提出完了した営業担当者は評価対象から除外される
    expect(evaluation_result.submitted_staff_id).toBe("staff_001");
    expect(evaluation_result.remaining_evaluation_target_ids).toContain(
      "staff_002"
    );
    expect(evaluation_result.remaining_evaluation_target_ids).toContain(
      "staff_003"
    );
    expect(evaluation_result.remaining_evaluation_target_ids).not.toContain(
      "staff_001"
    );
  });
});