import { analyzeProposalAndCustomerResponsePatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-723: [edge] 提案内容と顧客対応パターンの標準プロセス比較分析 - 分析期間が年度をまたぐ場合の標準プロセス比較が正確に実行される
  test('分析期間が年度をまたぐ場合、年度別に標準プロセス定義が適用され乖離率が正確に算出される', () => {
    const previous_fiscal_year_process_def = {
      fiscal_year: 2023,
      process_steps: [
        { step_id: 'initial_contact', step_name: '初回接触', expected_days: 1 },
        { step_id: 'proposal', step_name: '提案', expected_days: 5 },
        { step_id: 'negotiation', step_name: '交渉', expected_days: 10 },
        { step_id: 'contract', step_name: '成約', expected_days: 3 }
      ]
    };

    const current_fiscal_year_process_def = {
      fiscal_year: 2024,
      process_steps: [
        { step_id: 'initial_contact', step_name: '初回接触', expected_days: 1 },
        { step_id: 'proposal', step_name: '提案', expected_days: 4 },
        { step_id: 'negotiation', step_name: '交渉', expected_days: 8 },
        { step_id: 'contract', step_name: '成約', expected_days: 2 }
      ]
    };

    const previous_fiscal_data = [
      {
        activity_date: '2024-03-05',
        activity_type: 'proposal',
        salesperson_id: 'sp001',
        customer_id: 'cust001',
        days_from_initial_contact: 4
      },
      {
        activity_date: '2024-03-15',
        activity_type: 'negotiation',
        salesperson_id: 'sp001',
        customer_id: 'cust001',
        days_from_initial_contact: 14
      },
      {
        activity_date: '2024-03-20',
        activity_type: 'contract',
        salesperson_id: 'sp001',
        customer_id: 'cust001',
        days_from_initial_contact: 19
      }
    ];

    const current_fiscal_data = [
      {
        activity_date: '2024-04-02',
        activity_type: 'initial_contact',
        salesperson_id: 'sp001',
        customer_id: 'cust002',
        days_from_initial_contact: 0
      },
      {
        activity_date: '2024-04-08',
        activity_type: 'proposal',
        salesperson_id: 'sp001',
        customer_id: 'cust002',
        days_from_initial_contact: 6
      },
      {
        activity_date: '2024-04-18',
        activity_type: 'negotiation',
        salesperson_id: 'sp001',
        customer_id: 'cust002',
        days_from_initial_contact: 16
      },
      {
        activity_date: '2024-04-25',
        activity_type: 'contract',
        salesperson_id: 'sp001',
        customer_id: 'cust002',
        days_from_initial_contact: 23
      }
    ];

    const analysis_params = {
      start_date: '2024-03-01',
      end_date: '2024-04-30',
      analysis_types: ['proposal_pattern', 'customer_response_pattern'],
      process_definitions: {
        2023: previous_fiscal_year_process_def,
        2024: current_fiscal_year_process_def
      },
      activity_data: [...previous_fiscal_data, ...current_fiscal_data]
    };

    const result = analyzeProposalAndCustomerResponsePatterns(analysis_params);

    expect(result).toHaveProperty('fiscal_year_analyses');
    expect(result.fiscal_year_analyses).toHaveLength(2);

    const fy2023_analysis = result.fiscal_year_analyses.find(
      (analysis: { fiscal_year: number }) => analysis.fiscal_year === 2023
    );
    const fy2024_analysis = result.fiscal_year_analyses.find(
      (analysis: { fiscal_year: number }) => analysis.fiscal_year === 2024
    );

    expect(fy2023_analysis).toBeDefined();
    expect(fy2024_analysis).toBeDefined();

    expect(fy2023_analysis.date_range).toEqual({
      start_date: '2024-03-01',
      end_date: '2024-03-31'
    });

    expect(fy2024_analysis.date_range).toEqual({
      start_date: '2024-04-01',
      end_date: '2024-04-30'
    });

    const fy2023_proposal_deviation = fy2023_analysis.proposal_pattern_deviation_rate;
    expect(typeof fy2023_proposal_deviation).toBe('number');
    const fy2023_proposal_actual_days = 4;
    const fy2023_proposal_expected_days = 5;
    const fy2023_proposal_expected_deviation = Math.abs(
      (fy2023_proposal_actual_days - fy2023_proposal_expected_days) /
        fy2023_proposal_expected_days
    );
    expect(fy2023_proposal_deviation).toBeCloseTo(fy2023_proposal_expected_deviation, 2);

    const fy2023_negotiation_deviation =
      fy2023_analysis.customer_response_pattern_deviation_rate;
    expect(typeof fy2023_negotiation_deviation).toBe('number');
    const fy2023_negotiation_actual_days = 14;
    const fy2023_negotiation_expected_days = 10;
    const fy2023_negotiation_expected_deviation = Math.abs(
      (fy2023_negotiation_actual_days - fy2023_negotiation_expected_days) /
        fy2023_negotiation_expected_days
    );
    expect(fy2023_negotiation_deviation).toBeCloseTo(
      fy2023_negotiation_expected_deviation,
      2
    );

    const fy2024_proposal_deviation = fy2024_analysis.proposal_pattern_deviation_rate;
    expect(typeof fy2024_proposal_deviation).toBe('number');
    const fy2024_proposal_actual_days = 6;
    const fy2024_proposal_expected_days = 4;
    const fy2024_proposal_expected_deviation = Math.abs(
      (fy2024_proposal_actual_days - fy2024_proposal_expected_days) /
        fy2024_proposal_expected_days
    );
    expect(fy2024_proposal_deviation).toBeCloseTo(fy2024_proposal_expected_deviation, 2);

    const fy2024_negotiation_deviation =
      fy2024_analysis.customer_response_pattern_deviation_rate;
    expect(typeof fy2024_negotiation_deviation).toBe('number');
    const fy2024_negotiation_actual_days = 16;
    const fy2024_negotiation_expected_days = 8;
    const fy2024_negotiation_expected_deviation = Math.abs(
      (fy2024_negotiation_actual_days - fy2024_negotiation_expected_days) /
        fy2024_negotiation_expected_days
    );
    expect(fy2024_negotiation_deviation).toBeCloseTo(
      fy2024_negotiation_expected_deviation,
      2
    );

    expect(result).toHaveProperty('fiscal_year_boundary_recognition');
    expect(result.fiscal_year_boundary_recognition).toBe(true);

    expect(result).toHaveProperty('applied_process_definitions');
    expect(result.applied_process_definitions).toEqual({
      2023: previous_fiscal_year_process_def,
      2024: current_fiscal_year_process_def
    });

    expect(fy2023_analysis.data_count).toBe(3);
    expect(fy2024_analysis.data_count).toBe(4);

    expect(fy2023_analysis.analysis_types).toContain('proposal_pattern');
    expect(fy2023_analysis.analysis_types).toContain('customer_response_pattern');
    expect(fy2024_analysis.analysis_types).toContain('proposal_pattern');
    expect(fy2024_analysis.analysis_types).toContain('customer_response_pattern');
  });
});