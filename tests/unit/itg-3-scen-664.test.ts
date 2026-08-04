import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-664
  test('複数の項目に形式エラーがあるとき、すべての該当項目を指摘して修正を促す', () => {
    const invalid_customer_data = {
      customer_name: '12345',
      email: 'invalid-email',
      phone_number: 'abc-def',
    };

    const validation_result = validateCustomerInfo(invalid_customer_data);

    expect(validation_result.is_valid).toBe(false);
    expect(validation_result.errors).toHaveLength(3);
    expect(validation_result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'customer_name',
          message: expect.stringMatching(/英字と数字の組み合わせ/),
        }),
        expect.objectContaining({
          field: 'email',
          message: expect.stringMatching(/正しいメール形式/),
        }),
        expect.objectContaining({
          field: 'phone_number',
          message: expect.stringMatching(/数字、ハイフン、プラス/),
        }),
      ])
    );
    expect(validation_result.errors).toContainEqual({
      field: 'customer_name',
      message: '顧客名は英字と数字の組み合わせが必須です',
    });
    expect(validation_result.errors).toContainEqual({
      field: 'email',
      message: 'メールアドレスは正しいメール形式で入力してください',
    });
    expect(validation_result.errors).toContainEqual({
      field: 'phone_number',
      message: '電話番号は数字、ハイフン、プラスのみで構成してください',
    });
  });
});