import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  // SCEN-1528
  test('一致度スコアがちょうど閾値に等しい場合、その顧客は特定対象に含まれる', () => {
    const SIMILARITY_THRESHOLD = 0.75;
    
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          customerId: 'cust_001',
          customerName: '顧客A',
          similarityScore: 0.80,
          industry: 'IT',
          size: 'large'
        },
        {
          customerId: 'cust_002',
          customerName: '顧客B',
          similarityScore: 0.75,
          industry: 'Manufacturing',
          size: 'medium'
        },
        {
          customerId: 'cust_003',
          customerName: '顧客C',
          similarityScore: 0.70,
          industry: 'Finance',
          size: 'small'
        }
      ])
    };

    const currentCustomerData = {
      customerId: 'new_cust_001',
      customerName: '新規顧客',
      industry: 'IT',
      size: 'large',
      annualRevenue: 5000000
    };

    const result = findSimilarPatterns(currentCustomerData, mockAIEngine);

    expect(result.length).toBe(2);
    expect(result.some(c => c.customerId === 'cust_001' && c.similarityScore === 0.80)).toBe(true);
    expect(result.some(c => c.customerId === 'cust_002' && c.similarityScore === 0.75)).toBe(true);
    expect(result.some(c => c.customerId === 'cust_003' && c.similarityScore === 0.70)).toBe(false);
  });
});