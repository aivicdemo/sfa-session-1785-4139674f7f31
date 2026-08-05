import { evaluateSuccessPatternMatch } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-378
  test('成功パターンマッチング・提案アプローチ判定機能 - 顧客予算規模が成功パターンの金額範囲内にある場合、提案アプローチの適用可能性が判定される', () => {
    const successPatternData = {
      patternId: 'pattern_001',
      minBudget: 1000000,
      maxBudget: 5000000,
      recommendedApproach: 'コンサルティング型',
      successRate: 0.85,
    };

    const customerProfile = {
      customerId: 'cust_001',
      budget: 3000000,
      industry: 'manufacturing',
    };

    const result = evaluateSuccessPatternMatch(successPatternData, customerProfile);

    expect(result.isApplicable).toBe(true);
    expect(result.recommendedApproach).toBe('コンサルティング型');
    expect(result.matchReason).toMatch(/予算規模/);
  });
});