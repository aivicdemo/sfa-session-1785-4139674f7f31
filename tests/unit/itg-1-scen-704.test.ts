import { validateApprovalCriteria } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-704
  test("成功・失敗要因の抽出と承認基準判定機能 - 承認基準として定義された必須キーワード1つが要因に欠けているとき、承認不可と判定される", () => {
    const approval_criteria = {
      required_keywords: ["顧客要望確認", "競合分析", "提案内容"],
    };

    const success_failure_factors = {
      keywords: ["顧客要望確認", "提案内容"],
    };

    const result = validateApprovalCriteria(
      approval_criteria,
      success_failure_factors
    );

    expect(result.is_approved).toBe(false);
    expect(result.missing_keywords).toEqual(["競合分析"]);
    expect(result.missing_keywords.length).toBe(1);
  });
});