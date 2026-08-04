import { validateCustomerInfoForm } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-593
  test('[normal] 顧客情報入力フォーム検証機能 - 業種が空白のとき不備として指摘される', () => {
    const formData = {
      customerName: '株式会社テスト',
      email: 'test@example.com',
      phoneNumber: '09012345678',
      budgetScale: '1000万円',
      industry: '',
    };

    const result = validateCustomerInfoForm(formData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'industry',
          message: '業種は必須項目です',
        }),
      ])
    );
    expect(result.errors).toHaveLength(1);
    expect(result.isSubmitButtonEnabled).toBe(false);
    expect(result.fieldBorderColor.industry).toBe('red');
    expect(result.retainedValues).toEqual({
      customerName: '株式会社テスト',
      email: 'test@example.com',
      phoneNumber: '09012345678',
      budgetScale: '1000万円',
    });
  });
});