import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-700
  test("分析対象期間の開始日が null のとき期間指定が不正でエラーになる", () => {
    const startDate = null;
    const endDate = new Date("2024-01-31T23:59:59Z");
    const salesRepId = "SR001";

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        startDate,
        endDate,
        salesRepId,
      })
    ).toThrow(/分析対象期間の開始日/);
  });
});