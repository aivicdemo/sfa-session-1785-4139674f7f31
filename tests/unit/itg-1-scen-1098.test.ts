import { analyzeActionPatternAndProcessDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-1098: 成約実績1件の営業担当者について行動パターン分析が実行される', async () => {
    // Setup: 営業担当者IDと成約実績データを初期化
    const sales_employee_id = 'sales_emp_001';
    
    // Mock営業活動履歴データ
    const activity_history = [
      {
        activity_id: 'act_001',
        employee_id: sales_employee_id,
        customer_id: 'cust_001',
        activity_date: '2024-01-10T09:30:00Z',
        activity_type: 'initial_contact',
        activity_duration_minutes: 30,
      },
      {
        activity_id: 'act_002',
        employee_id: sales_employee_id,
        customer_id: 'cust_001',
        activity_date: '2024-01-15T14:00:00Z',
        activity_type: 'visit',
        activity_duration_minutes: 45,
      },
      {
        activity_id: 'act_003',
        employee_id: sales_employee_id,
        customer_id: 'cust_001',
        activity_date: '2024-01-18T11:00:00Z',
        activity_type: 'proposal_send',
        activity_duration_minutes: 0,
      },
      {
        activity_id: 'act_004',
        employee_id: sales_employee_id,
        customer_id: 'cust_001',
        activity_date: '2024-01-25T10:30:00Z',
        activity_type: 'negotiation',
        activity_duration_minutes: 60,
      },
    ];

    // Mock成約実績データ
    const contract_results = [
      {
        contract_result_id: 'contract_001',
        customer_id: 'cust_001',
        employee_id: sales_employee_id,
        deal_amount: 500000,
        contract_date: '2024-01-25T16:00:00Z',
      },
    ];

    // 標準プロセス定義
    const standard_process_definition = {
      process_steps: [
        { step_number: 1, step_name: 'initial_contact', target_days_from_start: 0 },
        { step_number: 2, step_name: 'first_visit', target_days_from_start: 3 },
        { step_number: 3, step_name: 'proposal', target_days_from_start: 5 },
        { step_number: 4, step_name: 'negotiation', target_days_from_start: 10 },
        { step_number: 5, step_name: 'contract', target_days_from_start: 15 },
      ],
      standard_contact_frequency: 3,
      standard_proposal_to_contract_days: 10,
    };

    // Call the function under test
    const analysis_result = await analyzeActionPatternAndProcessDeviation({
      employee_id: sales_employee_id,
      activity_history: activity_history,
      contract_results: contract_results,
      standard_process_definition: standard_process_definition,
      analysis_start_date: '2024-01-01',
      analysis_end_date: '2024-01-31',
    });

    // Assertions for response structure
    expect(analysis_result).toBeDefined();
    expect(analysis_result.employee_id).toBe(sales_employee_id);
    expect(analysis_result.analysis_period_start).toBe('2024-01-01');
    expect(analysis_result.analysis_period_end).toBe('2024-01-31');

    // Assertions for key metrics
    expect(analysis_result.contract_count).toBe(1);
    
    // Average contact frequency: 4 activities for 1 contract
    expect(analysis_result.average_contact_frequency).toBe(4);
    
    // Days from initial contact to contract: from 2024-01-10 to 2024-01-25 = 15 days
    expect(analysis_result.days_from_initial_to_contract).toBe(15);
    
    // Days from proposal send (2024-01-18) to contract (2024-01-25) = 7 days
    expect(analysis_result.days_from_proposal_to_contract).toBe(7);

    // Primary activity pattern (most frequent visit time: 10:30 or 11:00 morning hours)
    expect(analysis_result.primary_activity_pattern).toBeDefined();
    expect(analysis_result.primary_activity_pattern.most_frequent_time_of_day).toBe('morning');

    // Process deviation score calculation:
    // Standard process expects: initial_contact(day 0), first_visit(day 3), proposal(day 5),
    // negotiation(day 10), contract(day 15)
    // Actual: initial_contact(day 0), visit(day 5), proposal(day 8), negotiation(day 15), contract(day 15)
    // Deviation: day 5 vs 3 (2 days late), day 8 vs 5 (3 days late), day 15 vs 10 (5 days late)
    // Total deviation points: 2 + 3 + 5 = 10 out of 15 days max deviation = 10/15 * 100 = 66.67
    // Deviation score = 100 - 66.67 = 33.33 (lower is more deviated)
    // Recalculating: if max possible deviation is capped at certain value, expected score is ~33
    expect(analysis_result.process_deviation_score).toBe(33);

    // Assertions for metric ranges
    expect(typeof analysis_result.average_contact_frequency).toBe('number');
    expect(typeof analysis_result.days_from_initial_to_contract).toBe('number');
    expect(typeof analysis_result.days_from_proposal_to_contract).toBe('number');
    expect(typeof analysis_result.process_deviation_score).toBe('number');
    expect(analysis_result.process_deviation_score).toBeGreaterThanOrEqual(0);
    expect(analysis_result.process_deviation_score).toBeLessThanOrEqual(100);
  });
});