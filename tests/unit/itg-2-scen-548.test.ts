import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-548: 信頼度スコアが統合判定閾値より直上のとき、統合可能と判定される', () => {
    const merge_threshold = 0.85;
    const customer_pair_1 = {
      customer_id_1: 'CUST-001',
      customer_id_2: 'CUST-002',
      confidence_score: 0.851,
      similarity_name: 0.95,
      similarity_address: 0.80,
      similarity_phone: 0.75
    };

    const result = detectDuplicateCustomers(
      [customer_pair_1],
      merge_threshold
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      customer_id_1: 'CUST-001',
      customer_id_2: 'CUST-002',
      confidence_score: 0.851,
      can_merge: true,
      merge_decision: 'possible',
      reason: 'confidence_score exceeds threshold'
    });
    expect(result[0].can_merge).toBe(true);
    expect(result[0].confidence_score).toBe(0.851);
  });
});