import { detectDuplicateCustomersAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-523
  test('[normal] 複数件の正規化ルールが設定順序通りに適用され、重複が正確に判定される', () => {
    const normalizationRules = [
      {
        ruleId: 'rule_001',
        ruleName: '電話番号の先頭0を削除',
        targetField: 'phoneNumber',
        transformLogic: (value: string) => value.replace(/^0/, ''),
        priority: 1,
      },
      {
        ruleId: 'rule_002',
        ruleName: '会社名の全角スペースを半角に統一',
        targetField: 'companyName',
        transformLogic: (value: string) => value.replace(/　/g, ' '),
        priority: 2,
      },
      {
        ruleId: 'rule_003',
        ruleName: '郵便番号のハイフンを削除',
        targetField: 'postalCode',
        transformLogic: (value: string) => value.replace(/-/g, ''),
        priority: 3,
      },
    ];

    const customerA = {
      customerId: 'cust_001',
      phoneNumber: '090-1234-5678',
      companyName: 'ABC　Corporation',
      postalCode: '123-4567',
    };

    const customerB = {
      customerId: 'cust_002',
      phoneNumber: '9012345678',
      companyName: 'ABC Corporation',
      postalCode: '1234567',
    };

    const result = detectDuplicateCustomersAndMerge({
      customers: [customerA, customerB],
      normalizationRules: normalizationRules,
    });

    expect(result.isDuplicate).toBe(true);
    expect(result.mergeTarget).toBe('cust_001');
    expect(result.mergeSource).toBe('cust_002');

    expect(result.normalizationSteps).toEqual([
      {
        stepNumber: 1,
        ruleId: 'rule_001',
        ruleName: '電話番号の先頭0を削除',
        targetField: 'phoneNumber',
        beforeValue: '090-1234-5678',
        afterValue: '90-1234-5678',
      },
      {
        stepNumber: 2,
        ruleId: 'rule_002',
        ruleName: '会社名の全角スペースを半角に統一',
        targetField: 'companyName',
        beforeValue: 'ABC　Corporation',
        afterValue: 'ABC Corporation',
      },
      {
        stepNumber: 3,
        ruleId: 'rule_003',
        ruleName: '郵便番号のハイフンを削除',
        targetField: 'postalCode',
        beforeValue: '123-4567',
        afterValue: '1234567',
      },
    ]);

    expect(result.normalizedCustomerA).toEqual({
      customerId: 'cust_001',
      phoneNumber: '90-1234-5678',
      companyName: 'ABC Corporation',
      postalCode: '1234567',
    });

    expect(result.normalizedCustomerB).toEqual({
      customerId: 'cust_002',
      phoneNumber: '9012345678',
      companyName: 'ABC Corporation',
      postalCode: '1234567',
    });

    expect(result.ruleApplicationOrder).toEqual([
      'rule_001',
      'rule_002',
      'rule_003',
    ]);
  });
});