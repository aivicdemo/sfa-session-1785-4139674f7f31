import { judgeCustomerIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-118
  test('統合対象データの顧客名が空文字の場合、エラーとなる', () => {
    const mergeTargetData = {
      customerId: 'CUST-001',
      customerName: '',
      address: '東京都渋谷区1-2-3',
      phoneNumber: '03-1234-5678',
    };

    expect(() => judgeCustomerIntegration(mergeTargetData)).toThrow(/顧客名/);
  });
});