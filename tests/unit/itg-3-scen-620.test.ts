import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-620
  test('業種が空文字列のとき、必須項目不足エラーを返す', () => {
    const customerInfo = {
      name: '株式会社テスト',
      contactPerson: '山田太郎',
      contactPhone: '090-1234-5678',
      industry: '',
      companySize: '中堅企業',
    };

    const result = validateCustomerInfo(customerInfo);

    expect(result).toBeDefined();
    expect(result.errorCode).toBe('ERR_REQUIRED_FIELD_MISSING');
    expect(result.message).toMatch(/業種/);
    expect(result.message).toMatch(/必須/);
    expect(result.fieldName).toBe('industry');
  });
});