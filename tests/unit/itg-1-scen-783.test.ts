import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-783: [edge] 行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書に記載されるフォローアップ間隔の閾値がちょうど3日の場合、その値が指標選定に反映される
  test('should reflect followup_interval threshold of 3 days from sales process standard when selecting analysis indicators', () => {
    const sales_process_standard = {
      process_id: 'PROC-2024-001',
      process_name: '標準営業プロセス',
      stages: [
        {
          stage_id: 'STAGE-001',
          stage_name: '初回接触',
          kpi_criteria: {
            contact_frequency_target: 1,
            contact_frequency_unit: 'days'
          }
        },
        {
          stage_id: 'STAGE-002',
          stage_name: '提案',
          kpi_criteria: {
            proposal_success_rate_target: 0.5
          }
        },
        {
          stage_id: 'STAGE-003',
          stage_name: '交渉',
          kpi_criteria: {
            negotiation_duration_max: 14,
            negotiation_duration_unit: 'days'
          }
        },
        {
          stage_id: 'STAGE-004',
          stage_name: '成約',
          kpi_criteria: {
            followup_interval_threshold: 3,
            followup_interval_unit: 'days'
          }
        }
      ],
      data_items: ['initial_contact_date', 'proposal_date', 'negotiation_start_date', 'contract_date', 'followup_count', 'followup_interval_hours'],
      correlation_analysis_enabled: true
    };

    const contract_results = [
      {
        contract_id: 'CONT-001',
        sales_person_id: 'SP-001',
        customer_id: 'CUST-001',
        contract_amount: 500000,
        contract_date: '2024-01-15',
        followup_interval_days: 3,
        contract_status: 'completed'
      },
      {
        contract_id: 'CONT-002',
        sales_person_id: 'SP-001',
        customer_id: 'CUST-002',
        contract_amount: 300000,
        contract_date: '2024-01-20',
        followup_interval_days: 2,
        contract_status: 'completed'
      },
      {
        contract_id: 'CONT-003',
        sales_person_id: 'SP-002',
        customer_id: 'CUST-003',
        contract_amount: 750000,
        contract_date: '2024-01-25',
        followup_interval_days: 3,
        contract_status: 'completed'
      }
    ];

    const selected_indicators = selectAnalysisIndicators({
      sales_process_standard: sales_process_standard,
      contract_results: contract_results
    });

    expect(selected_indicators).toBeDefined();
    expect(selected_indicators.selected_indicators).toBeDefined();
    expect(Array.isArray(selected_indicators.selected_indicators)).toBe(true);
    expect(selected_indicators.selected_indicators.length).toBeGreaterThan(0);

    const followup_interval_indicator = selected_indicators.selected_indicators.find(
      (indicator: any) => indicator.indicator_name === 'followup_interval' || indicator.indicator_type === 'followup_interval'
    );

    expect(followup_interval_indicator).toBeDefined();
    expect(followup_interval_indicator.threshold_value).toBe(3);
    expect(followup_interval_indicator.threshold_unit).toBe('days');
    expect(followup_interval_indicator.threshold_value_in_hours).toBe(72);

    expect(selected_indicators.analysis_period_start).toBeDefined();
    expect(selected_indicators.analysis_period_end).toBeDefined();
    expect(selected_indicators.target_sales_persons).toBeDefined();
    expect(Array.isArray(selected_indicators.target_sales_persons)).toBe(true);
  });
});