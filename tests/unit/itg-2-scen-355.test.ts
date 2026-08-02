import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-355
  test('重複候補スコアが統合判定閾値未満の場合、統合判定が保留される', () => {
    const merge_threshold = 0.8;
    const duplicate_score = 0.75;

    const customer_a = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customer_b = {
      customer_id: 'CUST-002',
      customer_name: '山田太朗',
      email: 'yamada.taro@example.com',
    };

    const result = detectDuplicateCustomers({
      customers: [customer_a, customer_b],
      merge_threshold: merge_threshold,
      duplicate_score_stub: duplicate_score,
    });

    expect(result.merge_status).toBe('PENDING');
    expect(result.merge_reason_log).toMatch(/重複候補スコア0\.75が統合判定閾値0\.8未満/);
    expect(result.duplicate_score).toBe(0.75);
    expect(result.merge_executed).toBe(false);
  });
});