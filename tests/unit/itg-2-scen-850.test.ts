import { analyzeProcessExecutionByPeriod } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  test("SCEN-850: 分析対象期間が月末を含むとき、月末のデータが正しく対象に含まれる", () => {
    // テスト対象期間：2024年1月1日～2024年1月31日（月末を含む）
    const period_start = new Date("2024-01-01T00:00:00Z");
    const period_end = new Date("2024-01-31T23:59:59Z");

    // スタブデータ：月末2024年1月31日のレコード
    const month_end_record = {
      date: new Date("2024-01-31T12:00:00Z"),
      sales_rep_id: "A",
      sales_rep_name: "営業担当者A",
      revenue_amount: 500000,
      deal_count: 3,
    };

    // 分析実行
    const result = analyzeProcessExecutionByPeriod({
      start_date: period_start,
      end_date: period_end,
      records: [month_end_record],
    });

    // 期待結果：月末レコードが含まれており、売上集計が正確
    expect(result.included_records).toContainEqual(month_end_record);
    expect(result.total_revenue).toBe(500000);
    expect(result.total_deal_count).toBe(3);
    expect(result.period_contains_end_of_month).toBe(true);
  });
});