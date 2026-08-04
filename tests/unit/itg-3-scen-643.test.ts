import { validateCustomerInput } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  test('SCEN-643: 必須項目がすべて入力され、形式が正しい場合、入力受け付けが完了する', () => {
    const validCustomerInput = {
      customerName: '株式会社テスト',
      email: 'test@example.com',
      phoneNumber: '090-1234-5678',
      industry: 'IT',
      dealStage: '提案段階',
    };

    const result = validateCustomerInput(validCustomerInput);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.message).toBe('入力受け付けが完了しました');
  });
});