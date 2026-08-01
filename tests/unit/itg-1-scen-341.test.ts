import { generateSalesActivityAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-341
  test("営業活動の成約率が100%の場合、レポートに正常に反映される", () => {
    const sales_rep_id = "SR001";
    const sales_rep_name = "営業担当者A";
    const closed_deals = 10;
    const lost_deals = 0;
    const closed_rate = 100.0;

    const input = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      closed_deals_count: closed_deals,
      lost_deals_count: lost_deals,
    };

    const result = generateSalesActivityAnalysisReport(input);

    expect(result.closed_rate).toBe(closed_rate);
    expect(result.statistics_summary).toEqual({
      closed_deals: 10,
      lost_deals: 0,
    });
    expect(result.ranking).toEqual({
      rank: 1,
      sales_rep_name: "営業担当者A",
    });
  });
});