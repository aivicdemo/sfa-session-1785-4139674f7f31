import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-613
  test('重複候補1件の場合、統合判定対象に含まれる', () => {
    const customer_a = {
      customer_id: 1001,
      name: '山田太郎',
      email: 'yamada@example.com',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    const customer_b = {
      customer_id: 1002,
      name: '山田太郎',
      email: 'yamada.taro@example.com',
      created_at: '2024-01-15T10:05:00Z',
      updated_at: '2024-01-15T10:05:00Z',
    };

    const input_customers = [customer_a, customer_b];

    const result = detectDuplicateCustomers(input_customers);

    expect(result.duplicate_candidates).toHaveLength(1);

    const detected_pair = result.duplicate_candidates[0];
    expect(detected_pair.customer_id_1).toBe(1001);
    expect(detected_pair.customer_id_2).toBe(1002);
    expect(detected_pair.duplicate_score).toBeGreaterThanOrEqual(0.85);
    expect(detected_pair.duplicate_score).toBeLessThanOrEqual(1.0);
    expect(result.integration_target_list).toContainEqual({
      duplicate_candidate_id: detected_pair.duplicate_candidate_id,
      customer_id: 1001,
      comparison_target_customer_id: 1002,
      duplicate_score: detected_pair.duplicate_score,
    });
  });
});