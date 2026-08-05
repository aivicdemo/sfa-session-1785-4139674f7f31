import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("行動パターン分析レポート生成機能", () => {
  // SCEN-316: [normal] 行動パターン分析レポート生成機能 - 営業担当者ごとの行動パターンデータが0件の場合にレポートが生成される
  test("営業担当者の行動パターンデータが0件の場合、正常にレポートが生成される", async () => {
    const sales_person_id = "SP001";
    const sales_person_name = "営業太郎";
    const report_start_date = "2024-01-01";
    const report_end_date = "2024-01-31";
    const behavior_pattern_count = 0;
    const analysis_section_status = "no_data";

    const mock_response = {
      status_code: 200,
      report: {
        sales_person_id: sales_person_id,
        sales_person_name: sales_person_name,
        report_period: {
          start_date: report_start_date,
          end_date: report_end_date,
        },
        behavior_pattern_summary: {
          total_records: behavior_pattern_count,
          record_count_display: `データ件数: ${behavior_pattern_count}件`,
        },
        behavior_pattern_details: {
          status: analysis_section_status,
          data: [],
        },
        generated_at: "2024-01-31T12:00:00Z",
      },
    };

    const result = await generateSalesPersonBehaviorAnalysisReport({
      sales_person_id: sales_person_id,
      start_date: report_start_date,
      end_date: report_end_date,
    });

    expect(result).toEqual({
      status_code: 200,
      report: {
        sales_person_id: sales_person_id,
        sales_person_name: sales_person_name,
        report_period: {
          start_date: report_start_date,
          end_date: report_end_date,
        },
        behavior_pattern_summary: {
          total_records: 0,
          record_count_display: "データ件数: 0件",
        },
        behavior_pattern_details: {
          status: "no_data",
          data: [],
        },
        generated_at: expect.any(String),
      },
    });

    expect(result.status_code).toBe(200);
    expect(result.report.sales_person_id).toBe(sales_person_id);
    expect(result.report.sales_person_name).toBe(sales_person_name);
    expect(result.report.report_period.start_date).toBe(report_start_date);
    expect(result.report.report_period.end_date).toBe(report_end_date);
    expect(result.report.behavior_pattern_summary.total_records).toBe(0);
    expect(result.report.behavior_pattern_summary.record_count_display).toBe(
      "データ件数: 0件"
    );
    expect(result.report.behavior_pattern_details.status).toBe("no_data");
    expect(result.report.behavior_pattern_details.data).toEqual([]);
    expect(typeof result.report.generated_at).toBe("string");
  });
});