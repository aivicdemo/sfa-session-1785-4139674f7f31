import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  test('SCEN-1561: 一致度スコアが負の値を返すとき、エラーが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similarityScore: -0.5,
        matchedCustomers: []
      })
    };

    const newCaseInput = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      budgetRange: 'medium',
      dealSize: 5000000
    };

    expect(async () => {
      await findSimilarPatterns(newCaseInput, mockAIEngine);
    }).rejects.toThrow(/一致度スコア/);
  });
});