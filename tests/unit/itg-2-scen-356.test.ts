import { mergeDecisionEngine } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-356
  test('重複候補スコアが統合判定閾値を超える場合、統合判定が確定される', () => {
    const merge_threshold = 0.85;
    const duplicate_score = 0.86;
    
    const customer_record_a = {
      customer_id: 'CUST_001',
      customer_name: 'テスト顧客A',
      email: 'test_a@example.com',
      phone: '090-1234-5678',
    };
    
    const customer_record_b = {
      customer_id: 'CUST_002',
      customer_name: 'テスト顧客A',
      email: 'test_a@example.com',
      phone: '090-1234-5678',
    };
    
    const merge_decision_result = mergeDecisionEngine({
      record_a: customer_record_a,
      record_b: customer_record_b,
      duplicate_score: duplicate_score,
      merge_threshold: merge_threshold,
    });
    
    expect(merge_decision_result.mergeDecision).toBe('CONFIRMED');
    expect(merge_decision_result.mergeReason).toContain('重複候補スコア 0.86 が統合判定閾値 0.85 を超過');
  });
});