import { validateCustomerInfoInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力フォーム検証', () => {
  test('SCEN-594: 企業規模が空白のとき不備として指摘される', () => {
    // 必須項目を正常な値で入力し、企業規模フィールドだけを空白にする
    const customerInfoInput = {
      customerName: '株式会社テスト',
      industry: '製造業',
      dealAmount: 5000000,
      companySize: '', // 企業規模を空白にする
    };

    // フォーム検証を実行
    const validationResult = validateCustomerInfoInput(customerInfoInput);

    // 企業規模フィールドに対してバリデーションエラーが返されることを確認
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'companySize',
          message: '企業規模は必須項目です',
        }),
      ])
    );

    // 送信ボタンは押下不可状態であることを確認
    expect(validationResult.isSubmitDisabled).toBe(true);
  });
});