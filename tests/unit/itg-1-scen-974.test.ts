import { describe, test, expect } from "@jest/globals";
import { analyzeFailureFactorsAndApprove } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-974
  test("失敗要因が空配列のとき、エラーをスローする", () => {
    const success_factors = ["顧客との関係構築"];
    const failure_factors: string[] = [];
    const approval_threshold = 0.8;

    expect(() =>
      analyzeFailureFactorsAndApprove({
        success_factors,
        failure_factors,
        approval_threshold,
      })
    ).toThrow(/失敗要因/);
  });
});