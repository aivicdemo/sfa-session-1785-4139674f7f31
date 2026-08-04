import { validateCustomerEmail } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  test('SCEN-651: メールアドレス形式が不正なとき、該当項目の修正を促す', () => {
    // テストデータ: 不正なメールアドレス形式
    const invalidEmailFormats = [
      'user@domain',           // @の後ろにドメイン拡張子がない
      'user.domain.com',       // @がない
      'user@@domain.com',      // @が重複
      'user@.com',             // @とドメイン名の間が空
    ];

    // 各不正なメールアドレス形式をテスト
    invalidEmailFormats.forEach((invalidEmail) => {
      const customerInput = {
        email: invalidEmail,
      };

      const validationResult = validateCustomerEmail(customerInput);

      // 期待結果: バリデーションエラーが検出される
      expect(validationResult.isValid).toBe(false);

      // 期待結果: エラーメッセージが表示される
      expect(validationResult.errors).toBeDefined();
      expect(validationResult.errors.length).toBeGreaterThan(0);

      // 期待結果: エラーメッセージの内容が修正を促す
      expect(validationResult.errors[0]).toMatch(/メールアドレス/);
      expect(validationResult.errors[0]).toMatch(/user@example\.com/);
      expect(validationResult.errors[0]).toMatch(/形式/);

      // 期待結果: フォーム送信ボタンが無効状態
      expect(validationResult.isSubmitDisabled).toBe(true);

      // 期待結果: 外部サービスへの呼び出しは発生しない
      expect(validationResult.externalServiceCalls).toBe(0);
    });

    // 正常なメールアドレス形式をテスト（参考）
    const validCustomerInput = {
      email: 'user@example.com',
    };

    const validationResultValid = validateCustomerEmail(validCustomerInput);

    // 期待結果: バリデーション成功
    expect(validationResultValid.isValid).toBe(true);

    // 期待結果: エラーメッセージなし
    expect(validationResultValid.errors.length).toBe(0);

    // 期待結果: フォーム送信ボタンが有効状態
    expect(validationResultValid.isSubmitDisabled).toBe(false);

    // 期待結果: 外部サービスへの呼び出しは発生しない
    expect(validationResultValid.externalServiceCalls).toBe(0);
  });
});