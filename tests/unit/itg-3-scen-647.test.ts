import { validateCustomerName } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-647: [edge] 顧客情報入力検証機能 - 顧客名が1文字のとき、形式を正しいものとして受け付ける', () => {
    const customerName = '田';
    const result = validateCustomerName(customerName);

    expect(result).toEqual({
      isValid: true,
      errorCode: null,
      errorMessage: ''
    });
  });
});