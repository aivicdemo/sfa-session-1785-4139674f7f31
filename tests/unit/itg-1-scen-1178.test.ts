import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1178
  test('単一の営業担当者のレポートが生成される', () => {
    const sales_rep_id = 'EMP-12345';
    const period_start = new Date('2024-01-01T00:00:00Z');
    const period_end = new Date('2024-01-31T23:59:59Z');

    const result = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: sales_rep_id,
      period_start: period_start,
      period_end: period_end,
      behavior_records: [
        {
          record_id: 'BEH-001',
          sales_rep_id: sales_rep_id,
          activity_date: new Date('2024-01-15T10:00:00Z'),
          activity_type: 'customer_visit',
          customer_id: 'CUST-789',
          proposal_count: 1,
          follow_up_interval_days: 3,
        },
        {
          record_id: 'BEH-002',
          sales_rep_id: sales_rep_id,
          activity_date: new Date('2024-01-20T14:00:00Z'),
          activity_type: 'proposal_submission',
          customer_id: 'CUST-790',
          proposal_count: 1,
          follow_up_interval_days: 5,
        },
        {
          record_id: 'BEH-003',
          sales_rep_id: 'EMP-99999',
          activity_date: new Date('2024-01-18T11:00:00Z'),
          activity_type: 'customer_visit',
          customer_id: 'CUST-791',
          proposal_count: 1,
          follow_up_interval_days: 2,
        },
        {
          record_id: 'BEH-004',
          sales_rep_id: sales_rep_id,
          activity_date: new Date('2024-01-25T09:30:00Z'),
          activity_type: 'follow_up_call',
          customer_id: 'CUST-792',
          proposal_count: 0,
          follow_up_interval_days: 4,
        },
      ],
    });

    expect(result.sales_rep_id).toBe('EMP-12345');
    expect(result.period_start).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.period_end).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(result.included_behavior_records).toBe(3);
    expect(result.included_records).toHaveLength(3);
    expect(result.included_records.every((r) => r.sales_rep_id === 'EMP-12345')).toBe(true);
    expect(result.included_records.every((r) => r.activity_date >= period_start && r.activity_date <= period_end)).toBe(true);
    expect(result.status).toBe('生成完了');
    expect(result.generated_at).toBeDefined();
  });
});