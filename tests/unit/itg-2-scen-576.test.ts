import { determineModificationRuleApproval } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-576
  test("修正ルール案の妥当性スコアが欠けている場合、妥当性判定が失敗する", () => {
    const modificationRuleProposal = {
      ruleId: "RULE-001",
      ruleContent: "重複排除ロジックv2",
      pastExampleReferenceCount: 5,
      approvalBasisScore: 0.75,
      validityScore: null as null,
    };

    const result = determineModificationRuleApproval(modificationRuleProposal);

    expect(result.approvalStatus).toBe("VALIDATION_FAILED");
    expect(result.errorMessage).toMatch(/妥当性スコア/);
  });
});