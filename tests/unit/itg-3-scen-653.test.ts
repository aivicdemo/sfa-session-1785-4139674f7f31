import { validateCustomerInfoInput } from '../../src/logic/it-1-br-3-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推奨根拠の可視化機能 - 顧客情報入力検証', () => {
  test('SCEN-653: 電話番号が1件のとき、入力受け付けが完了する', () => {
    fetchMock.resetMocks();

    const customerInputData = {
      customerName: '山田太郎',
      industry: '製造業',
      phoneNumbers: ['09012345678']
    };

    const successResponse = {
      status: 'accepted',
      message: '顧客情報を受け付けました',
      customerId: 'CUST-20240115-001',
      submittedPhoneNumbers: ['09012345678']
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse), { status: 200 });

    const result = validateCustomerInfoInput(customerInputData);

    expect(result).toEqual({
      isAccepted: true,
      message: '顧客情報を受け付けました',
      customerId: 'CUST-20240115-001',
      displayPhoneNumbers: ['09012345678'],
      phoneNumberCount: 1,
      canAddPhoneNumber: false
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/customer/validate'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: expect.stringContaining('山田太郎')
      })
    );

    const callArgs = fetchMock.mock.calls[0];
    const requestBody = JSON.parse(callArgs[1].body);
    expect(requestBody.customerName).toBe('山田太郎');
    expect(requestBody.industry).toBe('製造業');
    expect(requestBody.phoneNumbers).toEqual(['09012345678']);
  });
});