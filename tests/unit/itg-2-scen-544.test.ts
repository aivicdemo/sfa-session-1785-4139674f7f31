import { detectDuplicateCustomers, normalizeCustomerData, judgeCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-544
  test('正規化ルール適用後に企業名が完全一致し、統合判定が可能に変わる', () => {
    const customer_a = {
      customer_id: 'CUST001',
      company_name: '㈱ Yamada  Corp. '
    };

    const customer_b = {
      customer_id: 'CUST002',
      company_name: '株式会社ヤマダコーポレーション'
    };

    // 正規化ルール適用
    const normalized_a = normalizeCustomerData(customer_a);
    const normalized_b = normalizeCustomerData(customer_b);

    // 正規化後の企業名が統一されたことを確認
    expect(normalized_a.company_name).toBe('株式会社ヤマダコーポレーション');
    expect(normalized_b.company_name).toBe('株式会社ヤマダコーポレーション');

    // 重複検出機能に入力
    const duplicate_candidates = detectDuplicateCustomers([normalized_a, normalized_b]);

    expect(duplicate_candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id_a: 'CUST001',
          customer_id_b: 'CUST002'
        })
      ])
    );

    // 統合判定ロジックが実行される
    const merge_judgment = judgeCustomerMerge(normalized_a, normalized_b);

    // 統合判定結果: merge=true（統合可能）
    expect(merge_judgment.can_merge).toBe(true);
    expect(merge_judgment.reason).toMatch(/企業名が完全一致/);
  });
});