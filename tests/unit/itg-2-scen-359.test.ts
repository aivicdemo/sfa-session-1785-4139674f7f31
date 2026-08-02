import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-359
  test('[normal] 顧客データ重複・不整合検出エンジン - 正規化ルール適用後の顧客名が不一致である場合、重複と判定されない', () => {
    const customerA = {
      recordId: 'CUST_A_001',
      normalizedName: '田中太郎',
      originalName: '田中 太郎',
      status: 'active'
    };

    const customerB = {
      recordId: 'CUST_B_001',
      normalizedName: '田中次郎',
      originalName: '田中次郎',
      status: 'active'
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.isDuplicate).toBe(false);
    expect(result.reason).toBe('正規化後の顧客名が不一致のため重複と判定されない');
  });
});