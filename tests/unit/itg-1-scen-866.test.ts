import {
  analyzeProcessDeviationAndCorrelateWithClosedDeals,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-866: [edge] 営業プロセス標準書との乖離分析と成約実績の相関分析 - 分析期間が年度をまたぐ場合、正確に日付を認識して集計する
  test("年度をまたぐ分析期間で、年度別サブ集計と期間全体合計が正確に計算される", () => {
    // Arrange: 分析期間の設定（2023年11月1日～2024年2月29日）
    const analysis_period_start_date = "2023-11-01";
    const analysis_period_end_date = "2024-02-29";

    // テストデータ: 2023年11月～12月のデータ10件
    const fiscal_2023_data = [
      {
        sales_activity_id: "ACT-001",
        activity_date: "2023-11-05",
        process_step: "initial_contact",
        deviation_degree: 0.1,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-002",
        activity_date: "2023-11-08",
        process_step: "proposal",
        deviation_degree: 0.2,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-003",
        activity_date: "2023-11-12",
        process_step: "negotiation",
        deviation_degree: 0.15,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-004",
        activity_date: "2023-11-15",
        process_step: "initial_contact",
        deviation_degree: 0.05,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-005",
        activity_date: "2023-11-18",
        process_step: "proposal",
        deviation_degree: 0.25,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-006",
        activity_date: "2023-12-01",
        process_step: "negotiation",
        deviation_degree: 0.12,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-007",
        activity_date: "2023-12-05",
        process_step: "proposal",
        deviation_degree: 0.18,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-008",
        activity_date: "2023-12-10",
        process_step: "initial_contact",
        deviation_degree: 0.08,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-009",
        activity_date: "2023-12-15",
        process_step: "negotiation",
        deviation_degree: 0.22,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-010",
        activity_date: "2023-12-20",
        process_step: "proposal",
        deviation_degree: 0.14,
        closed_deal_flag: true,
      },
    ];

    // テストデータ: 2024年1月～2月のデータ15件
    const fiscal_2024_data = [
      {
        sales_activity_id: "ACT-011",
        activity_date: "2024-01-02",
        process_step: "initial_contact",
        deviation_degree: 0.09,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-012",
        activity_date: "2024-01-05",
        process_step: "proposal",
        deviation_degree: 0.16,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-013",
        activity_date: "2024-01-08",
        process_step: "negotiation",
        deviation_degree: 0.11,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-014",
        activity_date: "2024-01-12",
        process_step: "proposal",
        deviation_degree: 0.19,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-015",
        activity_date: "2024-01-15",
        process_step: "initial_contact",
        deviation_degree: 0.07,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-016",
        activity_date: "2024-01-18",
        process_step: "negotiation",
        deviation_degree: 0.13,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-017",
        activity_date: "2024-01-22",
        process_step: "proposal",
        deviation_degree: 0.21,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-018",
        activity_date: "2024-01-25",
        process_step: "initial_contact",
        deviation_degree: 0.1,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-019",
        activity_date: "2024-02-01",
        process_step: "proposal",
        deviation_degree: 0.17,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-020",
        activity_date: "2024-02-05",
        process_step: "negotiation",
        deviation_degree: 0.14,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-021",
        activity_date: "2024-02-08",
        process_step: "initial_contact",
        deviation_degree: 0.06,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-022",
        activity_date: "2024-02-12",
        process_step: "proposal",
        deviation_degree: 0.2,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-023",
        activity_date: "2024-02-15",
        process_step: "negotiation",
        deviation_degree: 0.15,
        closed_deal_flag: true,
      },
      {
        sales_activity_id: "ACT-024",
        activity_date: "2024-02-20",
        process_step: "proposal",
        deviation_degree: 0.18,
        closed_deal_flag: false,
      },
      {
        sales_activity_id: "ACT-025",
        activity_date: "2024-02-25",
        process_step: "initial_contact",
        deviation_degree: 0.08,
        closed_deal_flag: true,
      },
    ];

    const combined_sales_data = [...fiscal_2023_data, ...fiscal_2024_data];

    const standard_process_definition = {
      stage_1: {
        stage_name: "initial_contact",
        expected_deviation_threshold: 0.2,
      },
      stage_2: { stage_name: "proposal", expected_deviation_threshold: 0.25 },
      stage_3: {
        stage_name: "negotiation",
        expected_deviation_threshold: 0.15,
      },
      stage_4: { stage_name: "closing", expected_deviation_threshold: 0.1 },
    };

    // Act: 分析APIの実行
    const analysis_result = analyzeProcessDeviationAndCorrelateWithClosedDeals({
      analysis_period_start: analysis_period_start_date,
      analysis_period_end: analysis_period_end_date,
      sales_activity_data: combined_sales_data,
      process_definition: standard_process_definition,
    });

    // Assert: 集計結果の検証

    // 期間全体の合計件数が25件であることを確認
    expect(analysis_result.total_aggregated_count).toBe(25);

    // 2023年度（11月～12月）のサブ集計結果が10件であることを確認
    expect(analysis_result.fiscal_year_2023_count).toBe(10);

    // 2024年度（1月～2月）のサブ集計結果が15件であることを確認
    expect(analysis_result.fiscal_year_2024_count).toBe(15);

    // 分析期間の開始日と終了日が正確に認識されていることを確認
    expect(analysis_result.analysis_period_recognized_start).toBe(
      "2023-11-01"
    );
    expect(analysis_result.analysis_period_recognized_end).toBe("2024-02-29");

    // 年度別の偏差度の平均が正確に計算されていることを確認
    // 2023年度データの偏差度合計: 0.1+0.2+0.15+0.05+0.25+0.12+0.18+0.08+0.22+0.14 = 1.49
    // 2023年度偏差度平均: 1.49 / 10 = 0.149
    expect(analysis_result.fiscal_year_2023_avg_deviation).toBeCloseTo(0.149, 3);

    // 2024年度データの偏差度合計: 0.09+0.16+0.11+0.19+0.07+0.13+0.21+0.1+0.17+0.14+0.06+0.2+0.15+0.18+0.08 = 1.84
    // 2024年度偏差度平均: 1.84 / 15 ≈ 0.1227
    expect(analysis_result.fiscal_year_2024_avg_deviation).toBeCloseTo(0.1227, 3);

    // 期間全体の成約率が正確に計算されていることを確認
    // 成約済み件数（closed_deal_flag === true）: 2023年度で4件、2024年度で7件、合計11件
    // 成約率: 11 / 25 = 0.44
    expect(analysis_result.total_closed_deal_rate).toBeCloseTo(0.44, 2);

    // 2023年度の成約率: 4 / 10 = 0.4
    expect(analysis_result.fiscal_year_2023_closed_deal_rate).toBeCloseTo(0.4, 1);

    // 2024年度の成約率: 7 / 15 ≈ 0.4667
    expect(analysis_result.fiscal_year_2024_closed_deal_rate).toBeCloseTo(
      0.4667,
      3
    );

    // 偏差度と成約率の相関分析結果が存在すること
    expect(analysis_result.deviation_closed_deal_correlation).toBeDefined();
    expect(
      typeof analysis_result.deviation_closed_deal_correlation
    ).toBe("number");

    // 集計に使用された日付範囲と件数の根拠データがシステムログに記録されていることを確認
    expect(analysis_result.aggregation_log).toBeDefined();
    expect(analysis_result.aggregation_log.date_range_start).toBe(
      "2023-11-01"
    );
    expect(analysis_result.aggregation_log.date_range_end).toBe("2024-02-29");
    expect(analysis_result.aggregation_log.total_records_counted).toBe(25);
    expect(
      analysis_result.aggregation_log.fiscal_2023_records_counted
    ).toBe(10);
    expect(
      analysis_result.aggregation_log.fiscal_2024_records_counted
    ).toBe(15);
    expect(
      analysis_result.aggregation_log.no_duplicates_or_omissions
    ).toBe(true);
  });
});