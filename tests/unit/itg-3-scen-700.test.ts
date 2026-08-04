import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  test('SCEN-700: 業種が空のとき、推奨生成不可と判定される', () => {
    // 業種フィールドが空文字列の場合
    const customerDataWithEmptyIndustry = {
      customerName: '株式会社テスト',
      companyName: 'Test Company Inc.',
      contactPhone: '03-1234-5678',
      industry: '',
      scale: '大企業'
    };

    const resultEmpty = validateCustomerDataCompleteness(customerDataWithEmptyIndustry);
    expect(resultEmpty.isValid).toBe(false);
    expect(resultEmpty.errors).toContainEqual(
      expect.objectContaining({
        field: 'industry',
        message: expect.stringMatching(/業種情報が未入力/)
      })
    );

    // 業種フィールドがnullの場合
    const customerDataWithNullIndustry = {
      customerName: '株式会社テスト2',
      companyName: 'Test Company 2 Inc.',
      contactPhone: '090-9876-5432',
      industry: null,
      scale: '中堅企業'
    };

    const resultNull = validateCustomerDataCompleteness(customerDataWithNullIndustry);
    expect(resultNull.isValid).toBe(false);
    expect(resultNull.errors).toContainEqual(
      expect.objectContaining({
        field: 'industry',
        message: expect.stringMatching(/業種情報が未入力/)
      })
    );

    // 期待される最終メッセージ
    const expectedErrorMessage = '業種情報が未入力です。推奨の生成には業種の入力が必須です';
    expect(resultEmpty.userMessage).toBe(expectedErrorMessage);
    expect(resultNull.userMessage).toBe(expectedErrorMessage);
  });
});