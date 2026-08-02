import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-448: 正規化ルール適用後に電話番号が完全に一致する場合、重複と判定される', () => {
    const customerA = {
      id: 'CUST-001',
      name: 'テスト太郎',
      phoneNumber: '09012345678',
    };

    const customerB = {
      id: 'CUST-002',
      name: 'テスト太郎',
      phoneNumber: '090-1234-5678',
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.duplicationStatus).toBe('duplicate');
    expect(result.matchedField).toBe('phoneNumber');
    expect(result.matchConfidencePercentage).toBe(100);
    expect(result.recommendedAction).toBe('merge');
  });
});