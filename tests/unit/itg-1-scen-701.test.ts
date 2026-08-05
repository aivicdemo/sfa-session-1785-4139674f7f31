import { describe, test, expect } from "@jest/globals";
import { generateSalesPersonActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-701
  test("分析対象期間の終了日が null のとき期間指定が不正でエラーになる", () => {
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = null;

    expect(() =>
      generateSalesPersonActivityPatternReport({
        analysisStartDate,
        analysisEndDate,
      })
    ).toThrow(/期間/);
  });
});