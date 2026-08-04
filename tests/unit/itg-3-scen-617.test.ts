import { validateCustomerInfo } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  // SCEN-617
  test('業種が空のとき、必須項目不足エラーを返す', async () => {
    const inputData = {
      customerName: 'テスト太郎',
      companyName: 'テスト株式会社',
      email: 'test@example.com',
      phoneNumber: '090-1234-5678',
      industry: ''
    };

    try {
      await validateCustomerInfo(inputData);
      fail('Expected validateCustomerInfo to throw an error');
    } catch (error: unknown) {
      expect(error).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringMatching(/業種/)
        })
      );
    }
  });
});