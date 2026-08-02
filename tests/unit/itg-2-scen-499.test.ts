import { judgeConsolidationTargetCustomer } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-499
  test('重複候補が1件のとき、その1件が統合対象として判定される', () => {
    const query_customer_id = 'CUST_A_001';
    const duplicate_candidates = [
      {
        customer_id: 'CUST_B_001',
        name: '山田太郎',
        address: '東京都渋谷区',
        email: 'yamada@example.com',
        match_score: 0.98,
      },
    ];

    const result = judgeConsolidationTargetCustomer({
      query_customer_id,
      duplicate_candidates,
    });

    expect(result.is_consolidation_target).toBe(true);
    expect(result.target_customer_id).toBe('CUST_B_001');
    expect(result.judgment_reason).toBe('重複候補が1件のため統合対象に指定');
  });
});