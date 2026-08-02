import { confirmDuplicateCustomerMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-164
  test('マスタレコードが指定されないとき、統合対象の確定が拒否される', () => {
    const duplicate_customer_ids = ['CUST_001', 'CUST_002'];
    const master_record_id = null;

    expect(() =>
      confirmDuplicateCustomerMerge({
        duplicate_customer_ids,
        master_record_id,
      })
    ).toThrow(/マスタレコード/);
  });
});