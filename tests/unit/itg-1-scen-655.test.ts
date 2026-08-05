import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-655
  test("レポート生成対象期間が複数月にまたがるとき、各月の境界を正確に処理して集計される", () => {
    const sales_rep_id = "SR_001";
    const start_date = new Date("2024-01-01T00:00:00Z");
    const end_date = new Date("2024-03-31T23:59:59Z");

    const activity_records = [
      // January activities (5 visits, 3 proposals)
      { activity_id: "ACT_001", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-05T10:00:00Z") },
      { activity_id: "ACT_002", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-10T14:30:00Z") },
      { activity_id: "ACT_003", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-15T09:15:00Z") },
      { activity_id: "ACT_004", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-20T16:45:00Z") },
      { activity_id: "ACT_005", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-25T11:20:00Z") },
      { activity_id: "ACT_006", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-01-08T13:00:00Z") },
      { activity_id: "ACT_007", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-01-18T10:30:00Z") },
      { activity_id: "ACT_008", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-01-28T15:45:00Z") },
      // January boundary (31st 23:59:59)
      { activity_id: "ACT_009", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-01-31T23:59:59Z") },

      // February activities (8 visits, 5 proposals)
      { activity_id: "ACT_010", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-02T10:00:00Z") },
      { activity_id: "ACT_011", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-05T14:30:00Z") },
      { activity_id: "ACT_012", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-08T09:15:00Z") },
      { activity_id: "ACT_013", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-12T16:45:00Z") },
      { activity_id: "ACT_014", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-16T11:20:00Z") },
      { activity_id: "ACT_015", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-20T13:00:00Z") },
      { activity_id: "ACT_016", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-24T10:30:00Z") },
      { activity_id: "ACT_017", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-28T15:45:00Z") },
      { activity_id: "ACT_018", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-02-03T13:00:00Z") },
      { activity_id: "ACT_019", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-02-07T10:30:00Z") },
      { activity_id: "ACT_020", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-02-14T15:45:00Z") },
      { activity_id: "ACT_021", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-02-19T11:00:00Z") },
      { activity_id: "ACT_022", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-02-27T14:30:00Z") },
      // February boundary (29th 23:59:59 - leap year)
      { activity_id: "ACT_023", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-02-29T23:59:59Z") },

      // March activities (6 visits, 4 proposals)
      { activity_id: "ACT_024", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-02T10:00:00Z") },
      { activity_id: "ACT_025", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-06T14:30:00Z") },
      { activity_id: "ACT_026", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-12T09:15:00Z") },
      { activity_id: "ACT_027", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-18T16:45:00Z") },
      { activity_id: "ACT_028", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-24T11:20:00Z") },
      { activity_id: "ACT_029", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-29T13:00:00Z") },
      { activity_id: "ACT_030", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-03-04T13:00:00Z") },
      { activity_id: "ACT_031", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-03-11T10:30:00Z") },
      { activity_id: "ACT_032", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-03-20T15:45:00Z") },
      { activity_id: "ACT_033", sales_rep_id, activity_type: "proposal", activity_date: new Date("2024-03-27T11:00:00Z") },
      // March boundary (31st 23:59:59)
      { activity_id: "ACT_034", sales_rep_id, activity_type: "visit", activity_date: new Date("2024-03-31T23:59:59Z") },
    ];

    const report = generateSalesActivityPatternReport(
      sales_rep_id,
      activity_records,
      start_date,
      end_date
    );

    // Verify January aggregation: 6 visits (including 31st), 3 proposals
    expect(report.monthly_aggregations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: "2024-01",
          visit_count: 6,
          proposal_count: 3,
        }),
      ])
    );

    // Verify February aggregation: 9 visits (including 29th), 5 proposals
    expect(report.monthly_aggregations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: "2024-02",
          visit_count: 9,
          proposal_count: 5,
        }),
      ])
    );

    // Verify March aggregation: 7 visits (including 31st), 4 proposals
    expect(report.monthly_aggregations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: "2024-03",
          visit_count: 7,
          proposal_count: 4,
        }),
      ])
    );

    // Verify total aggregation: 22 visits, 12 proposals
    expect(report.total_aggregation).toEqual(
      expect.objectContaining({
        total_visit_count: 22,
        total_proposal_count: 12,
      })
    );

    // Verify period coverage
    expect(report.period_start).toEqual(start_date);
    expect(report.period_end).toEqual(end_date);

    // Verify no boundary data duplication by checking total record count processed
    const total_activities_in_report = report.monthly_aggregations.reduce(
      (sum, month_data) => sum + month_data.visit_count + month_data.proposal_count,
      0
    );
    expect(total_activities_in_report).toBe(34);
  });
});