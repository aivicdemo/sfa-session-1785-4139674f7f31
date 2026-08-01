import { analyzeProcessComplianceAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-832
  test('営業プロセス標準書との乖離分析と成約実績の相関分析 - 営業担当者が1人の場合、その担当者の相関分析結果を返す', () => {
    const sales_rep_id = 'SR001';
    const analysis_start_date = new Date('2024-10-01T00:00:00Z');
    const analysis_end_date = new Date('2024-12-31T23:59:59Z');

    const sales_activities = [
      {
        id: 'ACT001',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-10-05T10:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST001',
        notes: 'Initial contact',
      },
      {
        id: 'ACT002',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-10-12T14:30:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST001',
        notes: 'Proposal presentation',
      },
      {
        id: 'ACT003',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-10-19T09:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST002',
        notes: 'Initial contact',
      },
      {
        id: 'ACT004',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-11-02T11:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST002',
        notes: 'Follow-up',
      },
      {
        id: 'ACT005',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-11-16T15:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST003',
        notes: 'Initial contact',
      },
      {
        id: 'ACT006',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-12-01T13:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST003',
        notes: 'Proposal',
      },
    ];

    const contract_results = [
      {
        id: 'CONTRACT001',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST001',
        contract_date: new Date('2024-10-25T00:00:00Z'),
        amount: 500000,
        case_content: 'Product A contract',
      },
      {
        id: 'CONTRACT002',
        sales_rep_id: sales_rep_id,
        customer_id: 'CUST003',
        contract_date: new Date('2024-12-10T00:00:00Z'),
        amount: 350000,
        case_content: 'Service B contract',
      },
    ];

    const standard_process = {
      standard_visit_frequency: 2.5,
      standard_lead_time_days: 20,
      standard_contract_rate: 0.65,
    };

    const analysis_result = analyzeProcessComplianceAndCorrelation(
      sales_rep_id,
      analysis_start_date,
      analysis_end_date,
      sales_activities,
      contract_results,
      standard_process
    );

    expect(analysis_result.sales_rep_id).toBe(sales_rep_id);
    expect(analysis_result.actual_visit_frequency).toBe(6);
    expect(analysis_result.actual_lead_time_days).toBe(20);
    expect(analysis_result.actual_contract_rate).toBe(0.333);
    expect(analysis_result.deviation_rate_percentage).toBe(48.846);
    expect(analysis_result.correlation_score).toBe(52);
    expect(analysis_result.data_set_period_start).toEqual(analysis_start_date);
    expect(analysis_result.data_set_period_end).toEqual(analysis_end_date);
    expect(analysis_result.data_set_record_count).toBe(8);
    expect(analysis_result.calculation_logic_version).toBe('v1.0.0');
    expect(Array.isArray(analysis_result.analysis_results)).toBe(false);
    expect(analysis_result.analysis_results).toBeUndefined();
  });
});