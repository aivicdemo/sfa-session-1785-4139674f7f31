import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-830
  test('顧客IDがnullのとき、ValidationErrorがスローされる', () => {
    const invalidRequest = {
      customerId: null,
      industry: 'manufacturing',
      companySize: 'large',
      currentNeeds: ['cost-reduction', 'process-automation'],
      budget: 5000000,
      timeline: 'Q2-2024'
    };

    expect(() => generateRecommendation(invalidRequest)).toThrow(/顧客ID/);
  });
});