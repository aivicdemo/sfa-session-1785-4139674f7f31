import { classifyDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・分類機能', () => {
  // SCEN-534
  test('重複原因パターン定義が0件のとき、分類不可と判定して結果に記録する', () => {
    const duplicatePatterns = [];
    const customerPairA = {
      customerId_1: 'CUST-001',
      customerName_1: '株式会社ABC',
      customerId_2: 'CUST-002',
      customerName_2: 'ABC',
    };

    const result = classifyDuplicateCustomers(
      [customerPairA],
      duplicatePatterns
    );

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('UNCLASSIFIABLE');
    expect(result[0].classificationReason).toBe(
      '重複原因パターン定義が0件のため分類不可'
    );
    expect(result[0].matchedPatternId).toBeNull();
  });
});