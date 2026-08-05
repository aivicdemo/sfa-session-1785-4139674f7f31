import { recordAndStandardizeCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-427
  test('営業担当者IDがnullのとき、エラーが発生する', () => {
    const input = {
      sales_rep_id: null,
      customer_id: 'CUST-001',
      response_content: 'メール返信あり',
      response_datetime: new Date('2024-01-15T14:30:00Z'),
    };

    expect(() => recordAndStandardizeCustomerResponse(input)).toThrow(/営業担当者ID/);
  });
});