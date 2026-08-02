import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-611
  test('[normal] 同一の顧客データで2回検証実行した場合、同じ結果が返される', () => {
    const testCustomerData = {
      customerId: 'CUST-001',
      customerName: '山田太郎',
      email: 'yamada@example.com',
      address: '東京都渋谷区'
    };

    const firstValidationResult = validateSalesData(testCustomerData);
    const secondValidationResult = validateSalesData(testCustomerData);

    expect(firstValidationResult.validationScore).toBe(secondValidationResult.validationScore);
    expect(firstValidationResult.errorCodes).toEqual(secondValidationResult.errorCodes);
    expect(firstValidationResult.warningInfo).toEqual(secondValidationResult.warningInfo);
    expect(firstValidationResult.fieldValidationResults).toEqual(
      secondValidationResult.fieldValidationResults
    );
  });
});