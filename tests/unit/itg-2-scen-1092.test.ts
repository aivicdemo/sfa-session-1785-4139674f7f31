import { detectAndMergeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1092
  test('重複判定スコアが閾値未満のとき、重複ではないと判定される', () => {
    const customerA = {
      id: 'C001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const customerB = {
      id: 'C002',
      name: '山田太郎',
      email: 'yamada.t@example.com',
    };

    const result = detectAndMergeDuplicateCustomers([customerA, customerB]);

    expect(result.isDuplicate).toBe(false);
    expect(result.score).toBe(0.45);
    expect(result.reason).toBe('スコア0.45は閾値0.5未満のため重複ではありません');
    expect(result.mergedRecords).toHaveLength(2);
    expect(result.mergedRecords[0].id).toBe('C001');
    expect(result.mergedRecords[1].id).toBe('C002');
  });
});