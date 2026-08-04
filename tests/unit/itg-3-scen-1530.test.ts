import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1530
  test('[normal] 類似顧客マッチング処理 - 一致度スコアが閾値より直上の場合、その顧客は特定対象に含まれる', () => {
    const threshold = 0.75;
    const matchScore = 0.751;
    const testCustomer = {
      customerId: 'CUST-001',
      industry: '製造業',
      budget: 5000000,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: matchScore,
        isRelevant: matchScore > threshold,
      }),
    };

    const result = evaluatePatternRelevance(
      {
        customerId: testCustomer.customerId,
        industry: testCustomer.industry,
        budget: testCustomer.budget,
      },
      threshold,
      mockAIEngine
    );

    const matchedCustomers = [
      {
        customerId: result.customerId,
        matchScore: result.score,
        industry: result.industry,
        budget: result.budget,
      },
    ].filter((customer) => customer.matchScore > threshold);

    expect(matchedCustomers).toHaveLength(1);
    expect(matchedCustomers[0]).toEqual({
      customerId: 'CUST-001',
      matchScore: 0.751,
      industry: '製造業',
      budget: 5000000,
    });
    expect(matchedCustomers[0].matchScore).toBeGreaterThan(threshold);
  });
});