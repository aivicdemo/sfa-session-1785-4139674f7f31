import { approveRevisionRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-574: [error] 修正ルール承認判定機能 - ユーザー情報が欠けている場合、権限判定が失敗する", () => {
    const revisionRuleId = "rule-001";
    const revisionsRuleContent = "顧客名の重複排除ルール";
    const incompleteUserInfo = {
      userId: "user-123",
      userName: null,
      department: null,
      permissionLevel: null,
    };

    expect(() =>
      approveRevisionRule({
        revisionRuleId,
        revisionsRuleContent,
        userInfo: incompleteUserInfo,
      })
    ).toThrow(/ユーザー情報/);
  });
});