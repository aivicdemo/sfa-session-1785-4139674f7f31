import { judgeCustomerIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-884
  test('[normal] 顧客データ統合判定機能 - 同じ入力条件で統合判定を2回実行したとき、同じ結果が返される', () => {
    const testCustomerDataSet = {
      customerId: 'CUST-001',
      customerName: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678'
    };

    const resultFirst = judgeCustomerIntegration(testCustomerDataSet);
    const resultSecond = judgeCustomerIntegration(testCustomerDataSet);

    expect(resultFirst.shouldIntegrate).toBe(resultSecond.shouldIntegrate);
    expect(resultFirst.targetRecordIds).toEqual(resultSecond.targetRecordIds);
    expect(resultFirst.integrationReasonCodes).toEqual(resultSecond.integrationReasonCodes);
  });
});