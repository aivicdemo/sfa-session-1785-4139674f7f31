import { recordAndStandardizeCustomerResponse } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-302
  test('顧客IDが欠落している場合エラーが発生する', () => {
    const customerResponseData = {
      customerId: null,
      responseDateTime: new Date('2024-01-15T14:30:00Z'),
      responseContent: 'Interested in the proposal',
      responseType: 'EMAIL_REPLY',
      recordedBy: 'sales_user_001',
      recordedAt: new Date('2024-01-15T14:31:00Z'),
    };

    expect(() => recordAndStandardizeCustomerResponse(customerResponseData)).toThrow(/顧客ID/);
  });
});