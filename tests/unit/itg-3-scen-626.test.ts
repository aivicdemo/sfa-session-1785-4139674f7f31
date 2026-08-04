import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-626
  test('入力されたすべての必須項目が空のとき、必須項目不足エラーを返す', () => {
    const invalidCustomerInfo = {
      customerName: '',
      emailAddress: '',
      phoneNumber: '',
      dealContent: '',
    };

    expect(() => validateCustomerInfo(invalidCustomerInfo)).toThrow(/必須項目/);
  });
});