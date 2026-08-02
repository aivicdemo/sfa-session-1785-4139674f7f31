import { approveModificationRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-567
  test("修正ルール承認判定機能 - 承認権限を持つユーザーが修正ルール案を確認できる", () => {
    const approverUserId = "USER-APPROVER-001";
    const approverAuthLevel = "承認者";
    const ruleId = "RULE-001";
    const ruleName = "顧客名正規化ルール";
    const targetDataField = "顧客名";
    const modificationCondition = "英数字混在の顧客名を統一形式に変換";
    const modificationContent = "半角英数字を全角に統一し、企業サフィックス（株、㈱）を統一";
    const proposedDateTime = "2024-01-15T10:30:00Z";
    const proposerName = "データ品質マネージャー";
    const pastExamplesCount = 127;
    const similarPatternMatchRate = 0.94;
    const ruleStatus = "承認待ち";

    const modificationRuleDraft = {
      ruleId: ruleId,
      ruleName: ruleName,
      targetDataField: targetDataField,
      modificationCondition: modificationCondition,
      modificationContent: modificationContent,
      proposedDateTime: proposedDateTime,
      proposerName: proposerName,
      pastExamplesCount: pastExamplesCount,
      similarPatternMatchRate: similarPatternMatchRate,
      status: ruleStatus,
    };

    const approverUser = {
      userId: approverUserId,
      authLevel: approverAuthLevel,
    };

    const result = approveModificationRule(approverUser, modificationRuleDraft);

    expect(result.canApprove).toBe(true);
    expect(result.ruleDetails.ruleId).toBe(ruleId);
    expect(result.ruleDetails.ruleName).toBe(ruleName);
    expect(result.ruleDetails.targetDataField).toBe(targetDataField);
    expect(result.ruleDetails.modificationCondition).toBe(
      modificationCondition
    );
    expect(result.ruleDetails.modificationContent).toBe(modificationContent);
    expect(result.ruleDetails.proposedDateTime).toBe(proposedDateTime);
    expect(result.ruleDetails.proposerName).toBe(proposerName);
    expect(result.ruleDetails.pastExamplesCount).toBe(pastExamplesCount);
    expect(result.ruleDetails.similarPatternMatchRate).toBe(
      similarPatternMatchRate
    );
    expect(result.ruleDetails.status).toBe(ruleStatus);
    expect(result.availableActions).toContain("approve");
    expect(result.availableActions).toContain("reject");
    expect(result.availableActions).toContain("remand");
  });
});