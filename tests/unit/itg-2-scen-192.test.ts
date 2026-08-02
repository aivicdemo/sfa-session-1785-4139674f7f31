import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-192
  test('重複候補顧客が0件のとき、統合判定が実行されない', async () => {
    const customerData = {
      customer_id: 'CUST001',
      customer_name: 'テスト顧客A',
      email: 'test-a@example.com',
      phone: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    };

    const result = await detectDuplicateCustomers({
      customer_records: [customerData],
      duplicate_detection_rules: [
        {
          rule_id: 'RULE001',
          name: '完全一致',
          condition: 'exact_match',
          priority: 1,
        },
      ],
      merge_decision_rules: [
        {
          rule_id: 'MERGE001',
          condition: 'confidence_score_gt_0_95',
          action: 'auto_merge',
        },
      ],
    });

    expect(result.duplicate_candidates_count).toBe(0);
    expect(result.merge_decision_executed).toBe(false);
    expect(result.status).toBe('SKIP_MERGE_DECISION');
    expect(result.message).toMatch(/統合判定/);
  });
});