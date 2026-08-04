import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  test('SCEN-1596: 一致度が閾値直上100.1%のとき、顧客が特定される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        matchedCustomers: [
          {
            customerId: 'CUST-001',
            matchScore: 100.1,
            industry: 'IT',
            companySize: 'large',
            budgetRange: '1000-5000',
          },
        ],
      }),
    };

    const newCustomerData = {
      industry: 'IT',
      companySize: 'large',
      budgetRange: '1000-5000',
    };

    const result = findSimilarPatterns(newCustomerData, mockAIEngine);

    expect(result.matchedCustomers).toHaveLength(1);
    expect(result.matchedCustomers[0].customerId).toBe('CUST-001');
    expect(result.matchedCustomers[0].customerId).not.toBeNull();
    expect(result.matchedCustomers[0].customerId).not.toBeUndefined();
    expect(result.matchedCustomers[0].matchScore).toBe(100.1);
  });
});