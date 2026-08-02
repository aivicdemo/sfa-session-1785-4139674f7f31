import { recordPurchaseResultAndIntegrate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-994
  test('操作ログが0件の場合でも監査証跡がaudit_trailに記録される', async () => {
    const input = {
      operation_log_count: 0,
      purchase_result: {
        customer_id: 'CUST_001',
        purchase_amount: 50000,
        product_category: 'SaaS',
        purchase_date: '2024-01-15T10:30:00Z',
      },
      integration_details: {
        integrated_customer_ids: ['CUST_001_A', 'CUST_001_B'],
        merge_count: 2,
        merged_fields: ['email', 'phone_number', 'address'],
      },
      executed_at: '2024-01-15T10:35:00Z',
      executed_by_user_id: 'USER_IT_001',
    };

    const result = await recordPurchaseResultAndIntegrate(input);

    expect(result.audit_trail_record_count).toBeGreaterThanOrEqual(1);
    expect(result.latest_audit_trail).toBeDefined();
    expect(result.latest_audit_trail.operation_type).toBe('データ統合');
    expect(result.latest_audit_trail.user_id).toBe('USER_IT_001');

    const audit_timestamp = new Date(result.latest_audit_trail.timestamp);
    const expected_timestamp = new Date('2024-01-15T10:35:00Z');
    const time_diff_seconds = Math.abs(
      (audit_timestamp.getTime() - expected_timestamp.getTime()) / 1000
    );
    expect(time_diff_seconds).toBeLessThanOrEqual(5);

    expect(result.latest_audit_trail.changes).toBeDefined();
    expect(result.latest_audit_trail.changes).toContain('統合件数');
    expect(result.latest_audit_trail.changes).toContain('2');
    expect(result.latest_audit_trail.changes).toContain('email');
    expect(result.latest_audit_trail.changes).toContain('phone_number');
    expect(result.latest_audit_trail.changes).toContain('address');
  });
});