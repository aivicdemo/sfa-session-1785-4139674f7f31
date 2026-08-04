import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-627
  test('顧客情報がnullのとき、入力形式エラーを返す', () => {
    const result = validateCustomerInfo(null);

    expect(result).toEqual({
      errorCode: 'INVALID_INPUT_FORMAT',
      message: '顧客情報がnullです',
      statusCode: 400,
    });
  });
});