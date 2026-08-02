import { validateAndMergeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1146
  test('無効な正規化ルール定義が適用される場合、検証に不合格となる', () => {
    const invalidNormalizationRule = {
      ruleId: 'rule_001',
      // ruleName が欠落
      // pattern が欠落
    };

    const customerData = {
      customerId: 'cust_001',
      customerName: 'テスト顧客',
      email: 'test@example.com',
    };

    const result = validateAndMergeCustomerData(
      customerData,
      invalidNormalizationRule
    );

    expect(result.validationStatus).toBe('FAILED');
    expect(result.errorCode).toBe('INVALID_NORMALIZATION_RULE_DEFINITION');
    expect(result.errorMessage).toMatch(/正規化ルール定義が無効です/);
    expect(result.isMerged).toBe(false);
  });
});