import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-658
  test('推奨内容根拠の可視化機能 - 商談詳細から推奨内容が抽出できないとき、推奨内容なしを示すデータが返される', async () => {
    fetchMock.resetMocks();

    const dealId = 'DEAL-20250102-001';
    const mockDealDetailsWithEmptyRecommendations = {
      dealId: dealId,
      customerId: 'CUST-0001',
      dealName: 'テスト商談',
      dealStatus: 'negotiation',
      recommendations: null,
    };

    fetchMock.mockResponseOnce(
      JSON.stringify(mockDealDetailsWithEmptyRecommendations),
      { status: 200 }
    );

    const result = await visualizeRecommendationBasis(dealId);

    expect(result).toEqual({
      dealId: dealId,
      recommendationsEmpty: true,
      recommendations: [],
      basis: {
        pastCases: [],
        successPatterns: [],
        customerData: [],
      },
    });
  });
});