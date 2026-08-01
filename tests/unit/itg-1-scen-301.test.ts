import { recordCustomerResponse } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-301
  test('顧客反応記録・標準化機能 - 営業担当者IDが欠落している場合エラーが発生する', () => {
    const request_body = {
      customerId: 'CUST-00001',
      dealId: 'DEAL-00001',
      responseType: 'email_reply',
      responseContent: '提案内容に興味があります',
      responseDate: new Date('2024-01-15T10:30:00Z'),
    };

    expect(() => recordCustomerResponse(request_body)).toThrow(/営業担当者ID/);
  });
});