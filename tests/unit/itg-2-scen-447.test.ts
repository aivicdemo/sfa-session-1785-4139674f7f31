import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-447
  test('電話番号が完全に一致する場合、重複と判定される', () => {
    const customerA = {
      customerId: 'A001',
      name: '山田太郎',
      phoneNumber: '09012345678',
      emailAddress: 'a@example.com'
    };

    const customerB = {
      customerId: 'B001',
      name: '山田太郎',
      phoneNumber: '09012345678',
      emailAddress: 'b@example.com'
    };

    const result = detectDuplicateCustomers(customerA, customerB);

    expect(result.judgementStatus).toBe('duplicate');
    expect(result.matchReason).toBe('phone_number_exact_match');
    expect(result.confidenceScore).toBe(100);
  });
});