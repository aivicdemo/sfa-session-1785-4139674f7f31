import { standardizeCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-430
  test('顧客IDが空文字列のとき、エラーが発生する', () => {
    const input = {
      customerId: '',
      responseContent: '提案に興味を示した',
      responseDateTime: new Date('2024-01-15T14:30:00Z'),
    };

    expect(() => standardizeCustomerResponse(input)).toThrow(/顧客ID/);
  });
});