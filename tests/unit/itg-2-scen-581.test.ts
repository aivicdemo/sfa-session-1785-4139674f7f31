import { approveModificationRuleByAI } from "../../src/logic/it-1-br-2-2-1-1";

describe("修正ルール承認判定機能", () => {
  // SCEN-581
  test("不整合検出ルールの妥当性が確認される", () => {
    const pastApprovalCases = [
      {
        ruleId: "rule_001",
        pattern: "名前表記揺れ統一",
        approvalStatus: "approved",
        appliedCount: 5,
        criteria: "正規化対象は表記揺れのみ",
      },
      {
        ruleId: "rule_002",
        pattern: "名前表記揺れ統一",
        approvalStatus: "approved",
        appliedCount: 3,
        criteria: "正規化対象は表記揺れのみ",
      },
      {
        ruleId: "rule_003",
        pattern: "郵便番号ハイフン統一",
        approvalStatus: "approved",
        appliedCount: 12,
        criteria: "形式統一のみ",
      },
    ];

    const newModificationRuleProposal = {
      pattern: "名前表記揺れ統一",
      description: "顧客名『山田太郎』『山田 太郎』を統一",
      normalizedValue: "山田太郎",
      targetPatterns: ["山田太郎", "山田 太郎"],
      criteria: "正規化対象は表記揺れのみ",
    };

    const result = approveModificationRuleByAI(
      newModificationRuleProposal,
      pastApprovalCases
    );

    expect(result.recommendedApprovalStatus).toBe("approved");
    expect(result.recommendationReason).toBe(
      "過去事例8件で同一パターンが承認済み、ルール基準『正規化対象は表記揺れのみ』に合致"
    );
    expect(result.similarPastCaseCount).toBe(2);
    expect(result.totalSimilarCaseApplicationCount).toBe(8);
    expect(result.matchesCriteria).toBe(true);
    expect(result.referencedPastCases).toEqual([
      {
        ruleId: "rule_001",
        pattern: "名前表記揺れ統一",
        appliedCount: 5,
      },
      {
        ruleId: "rule_002",
        pattern: "名前表記揺れ統一",
        appliedCount: 3,
      },
    ]);
  });
});