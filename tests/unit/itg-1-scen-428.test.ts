import { recordCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-428: [error] 営業担当者 ID が空文字列のとき、エラーが発生する
  test('営業担当者IDが空文字列の場合、バリデーションエラーが発生する', () => {
    const invalidInput = {
      sales_rep_id: '',
      customer_id: 'CUST-001',
      response_content: 'メール返信あり',
      response_timestamp: '2024-01-15T14:30:00Z',
      response_type: 'email_reply',
    };

    expect(() => recordCustomerResponse(invalidInput)).toThrow(/営業担当者ID/);
  });
});