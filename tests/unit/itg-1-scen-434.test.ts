import { standardizeCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応記録・標準化機能', () => {
  // SCEN-434
  test('[error] 反応記録タイムスタンプが null のとき、エラーが発生する', () => {
    const invalidCustomerResponse = {
      customerId: 'CUST-001',
      responseType: 'email_reply',
      recordContent: '顧客からの返信メール',
      timestamp: null,
      recordedBy: 'USER-123',
    };

    expect(() => standardizeCustomerResponse(invalidCustomerResponse))
      .toThrow(/timestamp/);
  });
});