import { judgeIssueImportance } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-610
  test("問題検出結果の重要度・対応必要性判定機能 - 営業管理職権限のないユーザーの判定処理は権限不足エラーとなる", () => {
    const input_issue_id = "issue_001";
    const input_importance_level = "HIGH";
    const input_response_required = true;
    const input_user_role = "general_sales";

    expect(() =>
      judgeIssueImportance({
        issueId: input_issue_id,
        importanceLevel: input_importance_level,
        responseRequired: input_response_required,
        userRole: input_user_role,
      })
    ).toThrow(/権限/);
  });
});