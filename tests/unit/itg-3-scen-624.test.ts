import { validateCustomerInformation } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客情報入力検証機能 - 企業規模形式エラー', () => {
  test('SCEN-624: 企業規模が定義外の値の場合、形式エラーを返す', () => {
    const invalidCustomerData = {
      name: 'テスト会社',
      industry: 'IT',
      companySize: '超大規模'
    };

    const response = validateCustomerInformation(invalidCustomerData);

    expect(response.statusCode).toBe(400);
    expect(response.error.code).toBe('INVALID_COMPANY_SIZE_FORMAT');
    expect(response.error.message).toBe('企業規模は定義された選択肢から選択してください');
    expect(response.error.details).toBeDefined();
    expect(response.error.details.invalidValue).toBe('超大規模');
    expect(response.data).toBeNull();
  });
});