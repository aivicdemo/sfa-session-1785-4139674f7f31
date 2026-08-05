import { calculateTeamSalesQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-884
  test('営業担当者の成約率がマイナス値のとき、エラーになる', () => {
    const salesRepresentatives = [
      {
        id: 'rep_001',
        name: '田中太郎',
        conversionRate: -0.15,
        proposalCount: 10,
        closedCount: 0,
        averageProposalAcceptanceRate: 0.5,
      },
      {
        id: 'rep_002',
        name: '佐藤花子',
        conversionRate: 0.25,
        proposalCount: 20,
        closedCount: 5,
        averageProposalAcceptanceRate: 0.6,
      },
    ];

    const result = calculateTeamSalesQualityStatistics(salesRepresentatives);

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_CONVERSION_RATE',
      errorMessage: '成約率は0以上1以下の値である必要があります',
      data: null,
    });
  });
});