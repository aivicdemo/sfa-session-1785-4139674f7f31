import { validateCustomerInfoForm } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-592
  test('顧客情報入力フォーム検証機能 - 顧客名が空白のとき不備として指摘される', () => {
    const formData = {
      customerId: 'CUST-001',
      customerName: '',
      industry: '製造業',
      companySize: '1000名以上',
    };

    const validationResult = validateCustomerInfoForm(formData);

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'customerName',
          message: expect.stringMatching(/顧客名/),
        }),
      ])
    );
    expect(validationResult.errors.some((err) => err.field === 'customerName')).toBe(true);
  });
});