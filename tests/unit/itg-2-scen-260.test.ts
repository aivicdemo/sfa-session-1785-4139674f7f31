import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-260
  test('顧客マスタが欠けているとき、重複検出処理がエラーになる', () => {
    const input = {
      customerId: 'CUST-001',
      customerName: '山田太郎',
      customerMasterData: [] as any[]
    };

    expect(() => {
      detectDuplicateCustomers(input);
    }).toThrow(/ERR_MASTER_NOT_FOUND|顧客マスタ/);
  });
});