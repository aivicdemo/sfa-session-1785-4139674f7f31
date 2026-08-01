import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-117
  test("プロセス標準書のシステム要件変換機能 - 判定基準が空文字列の場合、変換処理がエラーになる", () => {
    const invalidProcessStandard = {
      processId: "PROC-001",
      processName: "初回接触プロセス",
      requirementType: "DECISION_CRITERIA",
      criteria: "",
      dataItems: ["顧客名", "接触日時"],
      transitionRules: "接触完了後は次段階へ",
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(invalidProcessStandard)
    ).toThrow(/判定基準/);
  });
});