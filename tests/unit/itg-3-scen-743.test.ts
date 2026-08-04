import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客データ完全性・妥当性判定', () => {
  test('SCEN-743: 顧客名が空文字列のとき、推奨生成不可と判定される', () => {
    const customerData = {
      customerId: 'CUST-001',
      customerName: '',
      industry: 'IT',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'negotiation',
      contactHistory: 5,
      previousPurchaseCount: 3,
    };

    const validationResult = validateCustomerDataCompleteness(customerData);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.canGenerateRecommendation).toBe(false);
    expect(validationResult.validationErrors).toContain(
      '顧客名は必須項目です。空文字列は許可されません'
    );
  });
});