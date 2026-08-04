import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2204
  test('顧客対応の接触回数が0回のとき、接触パターンのマッチスコアが0で算出される', () => {
    const customerData = {
      customerId: 'CUST-001',
      contactCount: 0,
      industry: 'technology',
      companySize: 'large',
      previousSuccessPatterns: [],
    };

    const result = evaluatePatternRelevance(customerData);

    expect(result.matchScore).toBe(0);
  });
});