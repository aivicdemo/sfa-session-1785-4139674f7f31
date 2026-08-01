import { calculateProcessExecutionCorrelation } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業プロセス標準書との乖離分析と成約実績の相関分析", () => {
  // SCEN-828
  test("営業プロセス標準書の各ステップ実行度と成約率の相関係数を正常に計算する", () => {
    const test_data_sales_process_execution = [
      {
        sales_rep_id: "SR001",
        initial_contact_execution_rate: 95,
        needs_assessment_execution_rate: 88,
        proposal_execution_rate: 92,
        price_negotiation_execution_rate: 85,
        closing_execution_rate: 90,
        contract_rate: 72,
      },
      {
        sales_rep_id: "SR002",
        initial_contact_execution_rate: 80,
        needs_assessment_execution_rate: 75,
        proposal_execution_rate: 78,
        price_negotiation_execution_rate: 72,
        closing_execution_rate: 70,
        contract_rate: 55,
      },
      {
        sales_rep_id: "SR003",
        initial_contact_execution_rate: 92,
        needs_assessment_execution_rate: 85,
        proposal_execution_rate: 88,
        price_negotiation_execution_rate: 82,
        closing_execution_rate: 87,
        contract_rate: 68,
      },
      {
        sales_rep_id: "SR004",
        initial_contact_execution_rate: 78,
        needs_assessment_execution_rate: 70,
        proposal_execution_rate: 75,
        price_negotiation_execution_rate: 68,
        closing_execution_rate: 72,
        contract_rate: 52,
      },
      {
        sales_rep_id: "SR005",
        initial_contact_execution_rate: 88,
        needs_assessment_execution_rate: 82,
        proposal_execution_rate: 85,
        price_negotiation_execution_rate: 80,
        closing_execution_rate: 83,
        contract_rate: 65,
      },
      {
        sales_rep_id: "SR006",
        initial_contact_execution_rate: 96,
        needs_assessment_execution_rate: 90,
        proposal_execution_rate: 94,
        price_negotiation_execution_rate: 88,
        closing_execution_rate: 92,
        contract_rate: 75,
      },
      {
        sales_rep_id: "SR007",
        initial_contact_execution_rate: 82,
        needs_assessment_execution_rate: 76,
        proposal_execution_rate: 80,
        price_negotiation_execution_rate: 74,
        closing_execution_rate: 78,
        contract_rate: 58,
      },
    ];

    const test_analysis_period = {
      period_start_date: "2024-01-01",
      period_end_date: "2024-12-31",
    };

    const test_result = calculateProcessExecutionCorrelation(
      test_data_sales_process_execution,
      test_analysis_period
    );

    expect(test_result.correlation_coefficient).toBeGreaterThanOrEqual(-1.0);
    expect(test_result.correlation_coefficient).toBeLessThanOrEqual(1.0);

    expect(typeof test_result.correlation_coefficient).toBe("number");
    expect(test_result.data_point_count).toBe(7);
    expect(test_result.calculation_timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    expect(typeof test_result.dataset_hash).toBe("string");
    expect(test_result.dataset_hash.length).toBeGreaterThan(0);

    expect(test_result.analysis_period_start).toBe("2024-01-01");
    expect(test_result.analysis_period_end).toBe("2024-12-31");

    expect(test_result.calculation_method).toBe(
      "ピアソンの積率相関係数"
    );

    expect(test_result.correlation_coefficient).toBeCloseTo(0.78, 1);

    expect(test_result.report_format).toContain("相関係数:");
    expect(test_result.report_format).toContain("0.78");
    expect(test_result.report_format).toContain("データ件数:");
    expect(test_result.report_format).toContain("7件");
    expect(test_result.report_format).toContain("期間:");
    expect(test_result.report_format).toContain("2024年1月～12月");
    expect(test_result.report_format).toContain("計算方法:");
    expect(test_result.report_format).toContain("ピアソンの積率相関係数");
  });
});