import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-547
  test('信頼度スコアが統合判定閾値より直下のとき、統合「不可」と判定される', () => {
    const confidenceThreshold = 0.85;
    const confidenceScore = 0.84;

    const customerPair = {
      customer1_id: 'C001',
      customer1_name: 'ABC Corp',
      customer1_email: 'abc@example.com',
      customer2_id: 'C002',
      customer2_name: 'ABC Corporation',
      customer2_email: 'abc@example.com',
      confidence_score: confidenceScore,
      threshold: confidenceThreshold,
    };

    const result = detectDuplicateCustomers([customerPair]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      customer1_id: 'C001',
      customer2_id: 'C002',
      confidence_score: 0.84,
      can_merge: false,
      reason: '信頼度スコア 0.84 が閾値 0.85 を下回っている',
      threshold: 0.85,
    });
  });
});