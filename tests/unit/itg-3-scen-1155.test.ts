import { filterSuccessfulDealsByPeriod } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件へ推奨する機能", () => {
  // SCEN-1155
  test("過去成功商談の検索期間が年度をまたぐとき、正しく期間内データを抽出する", () => {
    const stub_deals = [
      {
        deal_id: "DEAL-2024-001",
        completed_date: new Date("2024-03-15"),
        success_flag: true,
        amount_jpy: 5000000,
      },
      {
        deal_id: "DEAL-2024-002",
        completed_date: new Date("2024-04-10"),
        success_flag: true,
        amount_jpy: 3000000,
      },
      {
        deal_id: "DEAL-2025-001",
        completed_date: new Date("2025-01-20"),
        success_flag: true,
        amount_jpy: 8000000,
      },
      {
        deal_id: "DEAL-2025-002",
        completed_date: new Date("2025-02-05"),
        success_flag: true,
        amount_jpy: 4000000,
      },
      {
        deal_id: "DEAL-2023-001",
        completed_date: new Date("2023-12-01"),
        success_flag: true,
        amount_jpy: 6000000,
      },
    ];

    const result = filterSuccessfulDealsByPeriod({
      deals: stub_deals,
      start_date: new Date("2024-04-01"),
      end_date: new Date("2025-03-31"),
      success_flag_filter: true,
    });

    expect(result.filtered_deals).toHaveLength(3);
    expect(result.filtered_deals.map((d) => d.deal_id)).toEqual([
      "DEAL-2024-002",
      "DEAL-2025-001",
      "DEAL-2025-002",
    ]);
    expect(result.total_amount_jpy).toBe(15000000);
  });
});