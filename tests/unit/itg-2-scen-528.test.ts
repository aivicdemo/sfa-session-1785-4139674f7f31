import { mergeDecisionExecute } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検知・統合判定機能', () => {
  // SCEN-528
  test('統合判定の実行日時が記録される', () => {
    const beforeExecution = new Date();
    beforeExecution.setMinutes(beforeExecution.getMinutes() - 1);

    const duplicateCustomerPairA = {
      customer_id_a: 'CUST_001',
      customer_name_a: '株式会社テスト',
      customer_id_b: 'CUST_002',
      customer_name_b: 'テスト株式会社',
    };

    const duplicateCustomerPairB = {
      customer_id_a: 'CUST_003',
      customer_name_a: '山田商事',
      customer_id_b: 'CUST_004',
      customer_name_b: '山田商事 東京支店',
    };

    const result = mergeDecisionExecute({
      duplicate_pairs: [duplicateCustomerPairA, duplicateCustomerPairB],
      merge_decision_rule_id: 'RULE_DUP_001',
      executed_by_user_id: 'USER_IT001',
    });

    const afterExecution = new Date();
    afterExecution.setMinutes(afterExecution.getMinutes() + 1);

    const executionTimestamp = result.merge_decision_executed_at;

    expect(executionTimestamp).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

    const parsedTime = new Date(executionTimestamp.replace(' ', 'T') + 'Z');
    expect(parsedTime.getTime()).toBeGreaterThanOrEqual(beforeExecution.getTime());
    expect(parsedTime.getTime()).toBeLessThanOrEqual(afterExecution.getTime());

    expect(result.merge_decision_id).toBeDefined();
    expect(result.merge_decision_status).toBe('confirmed');
    expect(result.duplicate_pairs_count).toBe(2);
  });
});