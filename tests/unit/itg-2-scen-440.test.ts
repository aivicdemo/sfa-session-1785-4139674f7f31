import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-440: [edge] 顧客データ重複検出と統合判定 - 重複候補顧客が0件の場合、統合不要と判定される
  test('重複候補顧客が0件の場合、統合不要と判定される', () => {
    const inputCustomer = {
      customer_id: 'C001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const result = detectDuplicateCustomersAndJudgeIntegration(inputCustomer);

    expect(result.integration_required).toBe(false);
    expect(result.status).toBe('NO_MERGE_NEEDED');
    expect(result.duplicate_count).toBe(0);
    expect(result.merge_targets).toEqual([]);
  });
});