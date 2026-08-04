import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-832
  test('商談IDがnullのとき、ValidationErrorをthrowして処理を中断する', () => {
    const nullDealId = null;
    const customerData = {
      customerId: 'CUST-001',
      industry: 'IT',
      scale: 'large',
      challenges: ['デジタル化', 'コスト削減'],
    };
    const dealConditions = {
      budget: 5000000,
      timeline: '3ヶ月',
      decisionMaker: 'CTO',
    };

    expect(() =>
      generateRecommendation(nullDealId, customerData, dealConditions)
    ).toThrow(/商談ID|dealId/);
  });
});