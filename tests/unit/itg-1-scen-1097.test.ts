import { analyzeActionPatternAndProcessDeviation } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能", () => {
  // SCEN-1097
  test("成約実績0件の営業担当者について行動パターン分析が実行される", () => {
    const sales_employee_id = "TEST_USER_001";
    const analysis_target_date_start = "2024-01-01T00:00:00Z";
    const analysis_target_date_end = "2024-03-31T23:59:59Z";
    const current_analysis_timestamp = "2024-04-01T10:30:00Z";

    const activity_log_data = [
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-01-05T09:00:00Z",
        customer_id: "CUST_001",
        duration_minutes: 30,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-01-12T14:00:00Z",
        customer_id: "CUST_002",
        duration_minutes: 45,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-01-19T10:30:00Z",
        customer_id: "CUST_003",
        duration_minutes: 35,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-02-02T11:00:00Z",
        customer_id: "CUST_004",
        duration_minutes: 40,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-02-09T09:30:00Z",
        customer_id: "CUST_005",
        duration_minutes: 50,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-02-16T15:00:00Z",
        customer_id: "CUST_006",
        duration_minutes: 30,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-02-23T10:00:00Z",
        customer_id: "CUST_007",
        duration_minutes: 45,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-03-01T14:30:00Z",
        customer_id: "CUST_008",
        duration_minutes: 40,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-03-08T11:00:00Z",
        customer_id: "CUST_009",
        duration_minutes: 35,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "customer_visit",
        activity_date: "2024-03-15T09:00:00Z",
        customer_id: "CUST_010",
        duration_minutes: 50,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-01-08T10:00:00Z",
        customer_id: "CUST_001",
        proposal_amount: 150000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-01-15T13:00:00Z",
        customer_id: "CUST_002",
        proposal_amount: 200000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-01-22T11:30:00Z",
        customer_id: "CUST_003",
        proposal_amount: 180000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-02-05T09:00:00Z",
        customer_id: "CUST_004",
        proposal_amount: 220000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-02-12T14:00:00Z",
        customer_id: "CUST_005",
        proposal_amount: 190000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-02-19T10:30:00Z",
        customer_id: "CUST_006",
        proposal_amount: 160000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-02-26T15:00:00Z",
        customer_id: "CUST_007",
        proposal_amount: 210000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "proposal_send",
        activity_date: "2024-03-04T11:00:00Z",
        customer_id: "CUST_008",
        proposal_amount: 175000,
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-06T08:00:00Z",
        customer_id: "CUST_001",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-07T09:30:00Z",
        customer_id: "CUST_001",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-09T14:00:00Z",
        customer_id: "CUST_002",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-11T10:00:00Z",
        customer_id: "CUST_002",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-13T15:30:00Z",
        customer_id: "CUST_002",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-16T09:00:00Z",
        customer_id: "CUST_003",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-01-20T11:00:00Z",
        customer_id: "CUST_003",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-01T08:30:00Z",
        customer_id: "CUST_004",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-03T13:00:00Z",
        customer_id: "CUST_004",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-07T10:00:00Z",
        customer_id: "CUST_005",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-10T14:30:00Z",
        customer_id: "CUST_005",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-14T09:00:00Z",
        customer_id: "CUST_006",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-17T15:00:00Z",
        customer_id: "CUST_006",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-21T10:30:00Z",
        customer_id: "CUST_007",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-24T14:00:00Z",
        customer_id: "CUST_007",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-02-28T11:00:00Z",
        customer_id: "CUST_008",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-02T09:30:00Z",
        customer_id: "CUST_008",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-06T13:00:00Z",
        customer_id: "CUST_009",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-10T10:00:00Z",
        customer_id: "CUST_009",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-13T14:30:00Z",
        customer_id: "CUST_010",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-17T11:00:00Z",
        customer_id: "CUST_010",
      },
      {
        sales_employee_id: "TEST_USER_001",
        activity_type: "email_send",
        activity_date: "2024-03-20T09:00:00Z",
        customer_id: "CUST_010",
      },
    ];

    const contract_results_data = [];

    const standard_process_steps = [
      {
        step_sequence: 1,
        step_name: "initial_contact",
        expected_day_range_min: 0,
        expected_day_range_max: 5,
      },
      {
        step_sequence: 2,
        step_name: "proposal",
        expected_day_range_min: 3,
        expected_day_range_max: 10,
      },
      {
        step_sequence: 3,
        step_name: "negotiation",
        expected_day_range_min: 5,
        expected_day_range_max: 20,
      },
      {
        step_sequence: 4,
        step_name: "contract",
        expected_day_range_min: 15,
        expected_day_range_max: 45,
      },
    ];

    const analysis_result = analyzeActionPatternAndProcessDeviation({
      sales_employee_id: sales_employee_id,
      analysis_target_period_start: analysis_target_date_start,
      analysis_target_period_end: analysis_target_date_end,
      activity_logs: activity_log_data,
      contract_results: contract_results_data,
      standard_process_definition: standard_process_steps,
      analysis_execution_timestamp: current_analysis_timestamp,
    });

    expect(analysis_result.sales_employee_id).toBe("TEST_USER_001");
    expect(analysis_result.customer_visit_frequency_monthly_avg).toBe(3.3);
    expect(analysis_result.proposal_to_contract_avg_days).toBeNull();
    expect(analysis_result.email_send_frequency_monthly_avg).toBe(8.3);
    expect(analysis_result.analysis_status).toBe("完了");
    expect(analysis_result.error_message).toBe("");

    const analysis_timestamp = new Date(
      analysis_result.analysis_execution_datetime
    );
    const current_timestamp = new Date(current_analysis_timestamp);
    const time_diff_ms = Math.abs(
      analysis_timestamp.getTime() - current_timestamp.getTime()
    );
    const time_diff_minutes = time_diff_ms / (1000 * 60);
    expect(time_diff_minutes).toBeLessThanOrEqual(1);
  });
});