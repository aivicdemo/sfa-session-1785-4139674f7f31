import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1156
  test("[edge] 分析対象期間が月初を含むとき正確に集計される", () => {
    const start_date = new Date("2024-01-01T00:00:00Z");
    const end_date = new Date("2024-01-31T23:59:59Z");

    const activity_data = [
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-01T09:00:00Z"),
        count: 3,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-02T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-03T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-04T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-05T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-06T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-07T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-08T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-09T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-10T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-11T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-12T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-13T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-14T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-15T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-16T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-17T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-18T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-19T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-20T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-21T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-22T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-23T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-24T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-25T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-26T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-27T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-28T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-29T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-30T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "A",
        activity_type: "顧客接触",
        activity_date: new Date("2024-01-31T09:00:00Z"),
        count: 2,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-01T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-02T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-03T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-04T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-05T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-06T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-07T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-08T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-09T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-10T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-11T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-12T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-13T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-14T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-15T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-16T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-17T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-18T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-19T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-20T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-21T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-22T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-23T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-24T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-25T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-26T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-27T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-28T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-29T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-30T10:00:00Z"),
        count: 1,
      },
      {
        sales_rep_id: "B",
        activity_type: "提案書作成",
        activity_date: new Date("2024-01-31T10:00:00Z"),
        count: 1,
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      analysis_period_start: start_date,
      analysis_period_end: end_date,
      activity_records: activity_data,
    });

    expect(report).toBeDefined();
    expect(report.analysis_period_start).toEqual(start_date);
    expect(report.analysis_period_end).toEqual(end_date);
    expect(report.sales_rep_summaries).toBeDefined();
    expect(Array.isArray(report.sales_rep_summaries)).toBe(true);

    const sales_rep_a_summary = report.sales_rep_summaries.find(
      (s) => s.sales_rep_id === "A"
    );
    expect(sales_rep_a_summary).toBeDefined();
    expect(sales_rep_a_summary?.activity_type).toBe("顧客接触");
    expect(sales_rep_a_summary?.total_count).toBe(63);

    const sales_rep_b_summary = report.sales_rep_summaries.find(
      (s) => s.sales_rep_id === "B"
    );
    expect(sales_rep_b_summary).toBeDefined();
    expect(sales_rep_b_summary?.activity_type).toBe("提案書作成");
    expect(sales_rep_b_summary?.total_count).toBe(31);
  });
});