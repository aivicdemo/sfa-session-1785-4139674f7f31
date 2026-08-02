import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-457: [edge] 顧客データ重複検出と統合判定 - 住所が空文字列である場合、該当属性を検証対象から除外する
  test('住所が空文字列の場合、該当属性を検証対象から除外して重複判定を実行する', () => {
    const recordA = {
      id: 'cust_001',
      name: '山田太郎',
      email: 'yamada@example.com',
      address: ''
    };

    const recordB = {
      id: 'cust_002',
      name: '山田太郎',
      email: 'yamada@example.com',
      address: '東京都渋谷区'
    };

    const validationConfig = {
      excludeAttributes: ['address']
    };

    const result = detectDuplicateCustomers(
      [recordA, recordB],
      validationConfig
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.reason).toEqual('名前とメールアドレスが一致。住所は検証対象外');
    expect(result.matchedRecordIds).toEqual(['cust_001', 'cust_002']);
    expect(result.validationAttributes).toEqual(['name', 'email']);
  });
});