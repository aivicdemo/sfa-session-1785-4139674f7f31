import { describe, test, expect } from "@jest/globals";
import { convertProcessStandardToSystemRequirements } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス標準書のシステム要件変換 - 判定基準欠落時エラー処理", () => {
  // SCEN-116
  test("判定基準が null の場合、ValidationError をスロー", () => {
    const input = {
      processId: "PROC-001",
      processName: "初回接触プロセス",
      requirementName: "顧客初回接触要件",
      priority: 1,
      criteria: null,
      dataItems: ["顧客名", "接触日時", "接触方法"],
      transitionRules: ["接触完了後は提案段階へ"],
    };

    expect(() => convertProcessStandardToSystemRequirements(input)).toThrow(
      /判定基準/
    );
  });
});