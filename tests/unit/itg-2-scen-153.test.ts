import { detectAndJudgeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-153
  test('名寄せ基準の重み付けスコアがちょうど閾値のとき、重複と判定される', () => {
    const customerA = {
      customerId: 'CUST001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678'
    };

    const customerB = {
      customerId: 'CUST002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5679'
    };

    const result = detectAndJudgeDuplicateCustomers(customerA, customerB);

    expect(result.isDuplicate).toBe(true);
    expect(result.matchingScore).toBe(80.0);
    expect(result.duplicateStatus).toBe('重複');
    expect(result.shouldMerge).toBe(true);
  });
});