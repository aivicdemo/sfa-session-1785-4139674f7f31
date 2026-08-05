import { generateSalesActivityReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析レポート生成機能', () => {
  // SCEN-552
  test('営業活動ログの活動タイプが欠落している場合、エラーになる', () => {
    const sales_rep_id = 'SR001';
    const sales_activity_logs = [
      {
        log_id: 'LOG001',
        sales_rep_id: 'SR001',
        activity_type: 'visit',
        activity_date: new Date('2024-01-10T10:00:00Z'),
        customer_id: 'CUST001',
        duration_minutes: 30,
        notes: 'Initial meeting',
      },
      {
        log_id: 'LOG002',
        sales_rep_id: 'SR001',
        activity_type: null,
        activity_date: new Date('2024-01-12T14:00:00Z'),
        customer_id: 'CUST002',
        duration_minutes: 20,
        notes: 'Follow-up call',
      },
    ];
    const period_start = new Date('2024-01-01T00:00:00Z');
    const period_end = new Date('2024-01-31T23:59:59Z');

    const result = generateSalesActivityReport(
      sales_rep_id,
      sales_activity_logs,
      period_start,
      period_end
    );

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('message');
    expect(result.error.message).toMatch(/活動タイプ/);
    expect(result.error).toHaveProperty('code', 'MISSING_ACTIVITY_TYPE');
    expect(result).not.toHaveProperty('report');
  });
});