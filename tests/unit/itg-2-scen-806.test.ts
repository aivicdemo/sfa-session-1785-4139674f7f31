import { detectDuplicateCustomersAndJudgeConsolidation } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-806
  test('重複度スコアが統合判定閾値超過の場合、統合対象として判定される', () => {
    const consolidation_threshold = 0.85;
    const duplicate_score = 0.87;
    const customer_a = {
      customer_id: 'CUST_001',
      name: '顧客A',
      email: 'customer_a@example.com',
    };
    const customer_b = {
      customer_id: 'CUST_002',
      name: '顧客A',
      email: 'customer_a@example.com',
    };

    const result = detectDuplicateCustomersAndJudgeConsolidation(
      customer_a,
      customer_b,
      duplicate_score,
      consolidation_threshold
    );

    expect(result.should_consolidate).toBe(true);
    expect(result.duplicate_score).toBe(0.87);
    expect(result.judgment_reason).toBe('閾値超過');
  });
});