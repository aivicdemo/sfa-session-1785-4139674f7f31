import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用', () => {
  // SCEN-357
  test('正規化ルールが適用されていない顧客名で重複判定が実行される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: '株式会社 テスト商事',
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: '株式会社テスト商事',
    };

    const result = detectDuplicateCustomers([customer_a, customer_b]);

    expect(result.is_duplicate).toBe(false);
    expect(result.duplicate_flag).toBe(false);
    expect(result.judgment_reason_log).toMatch(/正規化前の文字列比較により非重複と判定/);
  });
});