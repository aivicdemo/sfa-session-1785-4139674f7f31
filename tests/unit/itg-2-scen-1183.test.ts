import { integrateCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1183: 3件以上の顧客データが重複判定された場合、全件が1つに統合される', () => {
    // 入力: 3件の重複顧客データ
    const customer_a = {
      customer_id: '001',
      customer_name: '山田太郎',
      customer_email: 'yamada@example.com',
      updated_at: new Date('2024-01-10T10:00:00Z'),
    };

    const customer_b = {
      customer_id: '002',
      customer_name: '山田太郎',
      customer_email: 'yamada@example.com',
      updated_at: new Date('2024-01-12T14:30:00Z'),
    };

    const customer_c = {
      customer_id: '003',
      customer_name: '山田太郎',
      customer_email: 'yamada@example.com',
      updated_at: new Date('2024-01-15T09:15:00Z'),
    };

    const duplicate_customers = [customer_a, customer_b, customer_c];

    // 実行
    const result = integrateCustomerData(duplicate_customers);

    // 期待値: 3件が1件に統合される
    expect(result.integrated_customer_count).toBe(1);
    expect(result.source_customer_ids.length).toBe(3);
    expect(result.source_customer_ids).toEqual(['001', '002', '003']);

    // 統合後のレコード検証
    expect(result.integrated_customer.customer_id).toBeDefined();
    expect(result.integrated_customer.customer_name).toBe('山田太郎');
    expect(result.integrated_customer.customer_email).toBe('yamada@example.com');

    // 統合後のレコードには最新の更新日時が記録される
    // 入力3件の中で最新は customer_c の 2024-01-15T09:15:00Z
    expect(result.integrated_customer.updated_at).toEqual(
      new Date('2024-01-15T09:15:00Z')
    );

    // 統合履歴に3件のIDが参照情報として保持される
    expect(result.integration_history_references.length).toBe(3);
    expect(result.integration_history_references).toContain('001');
    expect(result.integration_history_references).toContain('002');
    expect(result.integration_history_references).toContain('003');

    // 統合判定結果が『重複』と判定されたことを確認
    expect(result.duplication_judgment).toBe('重複');

    // 重複判定スコアが基準以上であることを確認
    expect(result.duplication_score).toBeGreaterThanOrEqual(0.95);
  });
});