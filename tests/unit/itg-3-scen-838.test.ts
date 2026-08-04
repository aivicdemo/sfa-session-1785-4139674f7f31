import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-838: 根拠データが空配列のとき、エラーで処理が進まない', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue([]),
    };

    const dealConditions = {
      customerId: 'CUST-001',
      dealId: 'DEAL-20240115-001',
      customerIndustry: 'Manufacturing',
      customerSize: 'Large',
      productCategory: 'ERP',
      proposalAmount: 5000000,
      dealStage: 'Negotiation',
    };

    expect(() =>
      evaluateRecommendationRelevance(dealConditions, mockAIEngine)
    ).toThrow(/根拠データが不足/);
  });
});