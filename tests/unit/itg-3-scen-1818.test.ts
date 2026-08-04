import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  test('SCEN-1818: スコア計算結果が複数回実行されても同じ値が返却される（べき等性）', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      productCategory: 'SaaS',
      budgetScale: 500000,
      industry: 'IT',
    };

    const scoreFirstCall = evaluatePatternRelevance(dealCondition, mockAIEngine);
    const scoreSecondCall = evaluatePatternRelevance(dealCondition, mockAIEngine);
    const scoreThirdCall = evaluatePatternRelevance(dealCondition, mockAIEngine);

    expect(scoreFirstCall).toBe(0.85);
    expect(scoreSecondCall).toBe(0.85);
    expect(scoreThirdCall).toBe(0.85);
    expect(scoreFirstCall === scoreSecondCall && scoreSecondCall === scoreThirdCall).toBe(true);
  });
});