import { getCustomerDataForRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-666
  test('[normal] 推奨内容根拠の可視化機能 - 入力された顧客IDが有効なとき、対応する顧客データが取得される', async () => {
    const customerId = 'CUST-001';
    const expectedCustomerName = '山田太郎';
    const expectedIndustry = '製造業';
    const expectedRevenue = '5000万円';

    const mockResponse = {
      customerId: customerId,
      customerName: expectedCustomerName,
      industry: expectedIndustry,
      revenue: expectedRevenue,
    };

    const fetchMock = require('jest-fetch-mock');
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await getCustomerDataForRecommendationBasis(customerId);

    expect(result).toEqual({
      customerId: 'CUST-001',
      customerName: '山田太郎',
      industry: '製造業',
      revenue: '5000万円',
    });
    expect(result.customerName).toBe('山田太郎');
    expect(result.industry).toBe('製造業');
    expect(result.revenue).toBe('5000万円');
  });
});