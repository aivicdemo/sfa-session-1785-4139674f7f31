import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-596
  test('顧客名のみ入力されその他が空白のとき複数項目の不備が指摘される', () => {
    const input = {
      customerName: '山田太郎',
      email: '',
      phone: '',
      address: '',
      companyName: '',
    };

    const result = validateCustomerInfo(input);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
          message: 'メールアドレスは必須項目です',
        }),
        expect.objectContaining({
          field: 'phone',
          message: '電話番号は必須項目です',
        }),
        expect.objectContaining({
          field: 'address',
          message: '住所は必須項目です',
        }),
        expect.objectContaining({
          field: 'companyName',
          message: '企業名は必須項目です',
        }),
      ])
    );
    expect(result.errors.length).toBe(4);
  });
});