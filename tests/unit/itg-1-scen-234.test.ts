import { describe, test, expect } from "@jest/globals";
import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-234: 標準プロセス遵守度スコア計算機能 - 標準プロセスの定義ステップが存在しないときエラーになる", () => {
    const salesRepId = "rep_001";
    const complianceData = {
      initialContact: true,
      proposal: true,
      negotiation: false,
      closing: false,
    };

    const processDefinitionWithEmptySteps = {
      id: "proc_001",
      name: "Standard Sales Process",
      steps: [] as Array<{ id: string; name: string; sequence: number }>,
    };

    expect(() =>
      calculateProcessComplianceScore(
        salesRepId,
        complianceData,
        processDefinitionWithEmptySteps
      )
    ).toThrow(/標準プロセスの定義ステップが存在しません/);

    const processDefinitionWithNullSteps = {
      id: "proc_001",
      name: "Standard Sales Process",
      steps: null,
    };

    expect(() =>
      calculateProcessComplianceScore(
        salesRepId,
        complianceData,
        processDefinitionWithNullSteps as any
      )
    ).toThrow(/標準プロセスの定義ステップが存在しません/);
  });
});