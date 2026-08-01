import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-368
  test("終了日が開始日より前のとき、エラーが発生する", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-01-10T00:00:00Z");
    const sales_rep_id = "SR001";

    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        start_date,
        end_date,
        sales_rep_id,
      })
    ).toThrow(/終了日は開始日以降である必要があります/);
  });
});