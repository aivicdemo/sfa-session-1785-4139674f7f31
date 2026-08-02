import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-553
  test('重複原因パターンの優先度が未設定のとき、システムデフォルト優先度を使用して分類する', () => {
    const duplicatePatterns = [
      {
        patternId: 'pattern_001',
        patternName: '同一電話番号',
        priority: 100,
      },
      {
        patternId: 'pattern_002',
        patternName: '同一メールアドレス',
        priority: null,
      },
      {
        patternId: 'pattern_003',
        patternName: '同一法人名_住所',
        priority: undefined,
      },
    ];

    const systemDefaultPriority = 100;

    const duplicateCustomerPairs = [
      {
        customerId_1: 'CUST_001',
        customerName_1: '株式会社ABC',
        email_1: 'contact@abc.com',
        phone_1: '090-1234-5678',
        customerId_2: 'CUST_002',
        customerName_2: '株式会社ABC',
        email_2: 'contact@abc.com',
        phone_2: '090-1234-5678',
      },
      {
        customerId_1: 'CUST_003',
        customerName_1: '株式会社XYZ',
        email_1: 'info@xyz.com',
        phone_1: '03-9876-5432',
        customerId_2: 'CUST_004',
        customerName_2: '株式会社XYZ',
        email_2: 'contact@xyz.com',
        phone_2: '03-9876-5432',
      },
    ];

    const result = detectDuplicateCustomers({
      duplicatePatterns,
      systemDefaultPriority,
      duplicateCustomerPairs,
    });

    expect(result).toEqual({
      classificationResults: [
        {
          pairId: 0,
          customerId_1: 'CUST_001',
          customerId_2: 'CUST_002',
          detectedPatternId: 'pattern_002',
          detectedPatternName: '同一メールアドレス',
          assignedPriority: 100,
          matchingFields: ['email', 'phone'],
        },
        {
          pairId: 1,
          customerId_1: 'CUST_003',
          customerId_2: 'CUST_004',
          detectedPatternId: 'pattern_003',
          detectedPatternName: '同一法人名_住所',
          assignedPriority: 100,
          matchingFields: ['customerName', 'phone'],
        },
      ],
      totalProcessedPairs: 2,
      appliedDefaultPriorityCount: 2,
    });

    const emailPattern = result.classificationResults[0];
    expect(emailPattern.assignedPriority).toBe(100);
    expect(emailPattern.detectedPatternId).toBe('pattern_002');

    const nameAddressPattern = result.classificationResults[1];
    expect(nameAddressPattern.assignedPriority).toBe(100);
    expect(nameAddressPattern.detectedPatternId).toBe('pattern_003');

    expect(result.appliedDefaultPriorityCount).toBe(2);
  });
});