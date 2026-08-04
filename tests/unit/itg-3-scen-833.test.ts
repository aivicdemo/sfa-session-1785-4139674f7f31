import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-833
  test('商談IDが空文字列のとき、ValidationErrorが発生し推奨生成が中止される', () => {
    const invalidDealId = '';
    const customerContext = {
      customerId: 'CUST-001',
      industry: 'IT',
      companySize: 'large'
    };
    const dealContext = {
      dealId: invalidDealId,
      dealStage: 'proposal',
      dealAmount: 500000
    };

    expect(() =>
      generateRecommendation({
        customerContext,
        dealContext,
        historicalPatterns: []
      })
    ).toThrow(/商談ID/);
  });
});