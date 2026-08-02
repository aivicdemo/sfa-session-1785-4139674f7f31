import { analyzeProcessExecutionAcrossYears } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  test("SCEN-852: 分析対象期間が年度をまたぐとき、両年度のデータが正しく集約される", () => {
    // 分析対象期間を2024年2月1日～2025年1月31日に設定（会計年度をまたぐ期間）
    const analysis_start_date = new Date("2024-02-01T00:00:00Z");
    const analysis_end_date = new Date("2025-01-31T23:59:59Z");

    // 2024年度（2024/4/1～2025/3/31）の営業データ100件を模擬
    const fiscal_2024_data = Array.from({ length: 100 }, (_, idx) => ({
      id: `data_2024_${idx}`,
      record_date: new Date(
        2024 + Math.floor(idx / 50),
        3 + (idx % 50 < 25 ? 0 : 1),
        1 + (idx % 25)
      ).toISOString(),
      process_step: idx % 4 === 0 ? "initial_contact" : idx % 4 === 1 ? "proposal" : idx % 4 === 2 ? "negotiation" : "completion",
      sales_person_id: `sp_${idx % 10}`,
      deal_amount: 10000 + idx * 100,
    }));

    // 2025年度（2025/4/1～2026/3/31）の営業データ80件を模擬
    const fiscal_2025_data = Array.from({ length: 80 }, (_, idx) => ({
      id: `data_2025_${idx}`,
      record_date: new Date(
        2025 + Math.floor(idx / 40),
        3 + (idx % 40 < 20 ? 0 : 1),
        1 + (idx % 20)
      ).toISOString(),
      process_step: idx % 4 === 0 ? "initial_contact" : idx % 4 === 1 ? "proposal" : idx % 4 === 2 ? "negotiation" : "completion",
      sales_person_id: `sp_${idx % 8}`,
      deal_amount: 15000 + idx * 150,
    }));

    // 両年度のデータを結合
    const all_sales_data = [...fiscal_2024_data, ...fiscal_2025_data];

    // 分析実行
    const aggregation_result = analyzeProcessExecutionAcrossYears({
      analysis_period_start: analysis_start_date,
      analysis_period_end: analysis_end_date,
      sales_data: all_sales_data,
    });

    // 期待結果の検証
    // 1. 集約結果に含まれるデータ件数が180件であることを確認
    expect(aggregation_result.total_records_aggregated).toBe(180);

    // 2. 2024年度に属するデータが100件であることを確認
    expect(aggregation_result.fiscal_2024_record_count).toBe(100);

    // 3. 2025年度に属するデータが80件であることを確認
    expect(aggregation_result.fiscal_2025_record_count).toBe(80);

    // 4. 年度別の内訳が正確に表記されていることを確認
    expect(aggregation_result.breakdown_by_fiscal_year).toEqual({
      fiscal_2024: 100,
      fiscal_2025: 80,
    });

    // 5. 集約結果に両年度のデータが含まれていることを確認
    expect(aggregation_result.aggregated_records.length).toBe(180);
    const fiscal_2024_count_in_result = aggregation_result.aggregated_records.filter(
      (record) => record.id.startsWith("data_2024_")
    ).length;
    const fiscal_2025_count_in_result = aggregation_result.aggregated_records.filter(
      (record) => record.id.startsWith("data_2025_")
    ).length;
    expect(fiscal_2024_count_in_result).toBe(100);
    expect(fiscal_2025_count_in_result).toBe(80);
  });
});