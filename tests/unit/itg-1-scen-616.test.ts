import { describe, test, expect } from "@jest/globals";
import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-616
  test("提案数が0件の場合、成約率の計算でエラーとなる", () => {
    const sales_person_id = "SP001";
    const closed_deals_count = 0;
    const proposal_count = 0;
    const analysis_period_start = "2024-01-01";
    const analysis_period_end = "2024-01-31";

    expect(() =>
      generateSalesActivityPatternReport({
        sales_person_id,
        closed_deals_count,
        proposal_count,
        analysis_period_start,
        analysis_period_end,
      })
    ).toThrow(/提案数が0件/);
  });
});