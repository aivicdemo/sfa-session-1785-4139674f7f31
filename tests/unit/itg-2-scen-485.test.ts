import { determineRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-485
  test("重複検知ルール実行優先度決定機能 - ルール実行優先度がnullのときにエラーが発生する", () => {
    const ruleInput = {
      ruleId: "RULE-001",
      ruleName: "顧客名重複チェック",
      priority: null,
    };

    expect(() => determineRulePriority(ruleInput)).toThrow(
      /ルール実行優先度がnullまたは未定義です/
    );
  });
});