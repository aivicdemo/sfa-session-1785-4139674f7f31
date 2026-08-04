import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-701
  test('顧客規模が空のとき、推奨生成不可と判定される', () => {
    const customerDataWithEmptyScale = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      scale: '',
      contactPerson: '山田太郎',
      email: 'test@example.com'
    };

    const result = validateCustomerDataCompleteness(customerDataWithEmptyScale);

    expect(result.isValid).toBe(false);
    expect(result.validationErrors).toContain('顧客規模は必須項目です');
    expect(result.canGenerateRecommendation).toBe(false);
  });
});