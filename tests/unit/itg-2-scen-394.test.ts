import { normalizeCustomerName } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-394: 顧客名の大文字小文字を統一する正規化ルールが適用される', () => {
    // テスト用の顧客データセットを準備
    const customerA = {
      id: 'cust_001',
      name: 'TANAKA TARO',
    };

    const customerB = {
      id: 'cust_002',
      name: 'tanaka taro',
    };

    // 正規化ルール（大文字小文字を統一する処理）を適用
    const normalizedCustomerA = normalizeCustomerName(customerA);
    const normalizedCustomerB = normalizeCustomerName(customerB);

    // 期待結果：両顧客データが同じ正規化された形式『tanaka taro』（小文字統一）に変換されている
    expect(normalizedCustomerA.name).toBe('tanaka taro');
    expect(normalizedCustomerB.name).toBe('tanaka taro');

    // 大文字小文字の違いが解消されていることを検証
    expect(normalizedCustomerA.name).toEqual(normalizedCustomerB.name);
  });
});