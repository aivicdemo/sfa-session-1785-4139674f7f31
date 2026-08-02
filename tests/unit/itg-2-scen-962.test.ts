import { recordPurchaseDecisionAndIntegrateSalesData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-962
  test('[error] 購買結果記録・営業データ統合機能 - 購買確定日時が入力されていない場合に処理が中断される', () => {
    const purchaseRecordWithoutConfirmDatetime = {
      customer_id: 'CUST-00001',
      product_id: 'PROD-00123',
      amount: 150000,
      purchase_confirm_datetime: null,
      sales_rep_id: 'REP-0001',
      notes: 'Test purchase record'
    };

    expect(() =>
      recordPurchaseDecisionAndIntegrateSalesData(purchaseRecordWithoutConfirmDatetime)
    ).toThrow(/PURCHASE_CONFIRM_DATETIME_REQUIRED/);
  });
});