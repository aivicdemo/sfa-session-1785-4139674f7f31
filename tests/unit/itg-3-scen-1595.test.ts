import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客企業の購買タイミング最適化 - 類似顧客マッチング処理', () => {
  // SCEN-1595
  test('一致度が閾値直下99.9%のとき、顧客が特定されない', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        matchingScore: 99.9,
        similarPatterns: [
          {
            customerId: 'CUST-12345',
            companySize: 'large',
            industry: 'manufacturing',
            challenges: ['cost_reduction', 'supply_chain_optimization'],
            matchingScore: 99.9,
          },
        ],
      }),
    };

    const newDealCustomerData = {
      companySize: 'large',
      industry: 'manufacturing',
      challenges: ['cost_reduction', 'supply_chain_optimization'],
      budget: 5000000,
      decisionTimeline: '90days',
    };

    const result = await findSimilarPatterns(newDealCustomerData, mockAIEngine);

    expect(result.customerIdentified).toBe(false);
    expect(result.identifiedCustomerId).toBeNull();
    expect(result.matchingScore).toBe(99.9);
    expect(result.logMessage).toMatch(/99\.9.*閾値未満.*特定できません/);
  });
});