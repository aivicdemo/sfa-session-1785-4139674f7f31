import { recordPurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-991
  test('統合判定履歴が0件の場合でも購買結果が確定される', () => {
    const purchase_id = 'PO-20240115-001';
    const amount = 50000;
    const initial_status = '仮確定';
    const integration_count = 0;

    const result = recordPurchaseResult({
      purchase_id,
      amount,
      status: initial_status,
      integration_history_count: integration_count,
    });

    expect(result.status).toBe('確定');
    expect(result.confirmed_at).toBeDefined();
    expect(typeof result.confirmed_at).toBe('string');
    expect(result.purchase_id).toBe(purchase_id);
    expect(result.amount).toBe(amount);
  });
});