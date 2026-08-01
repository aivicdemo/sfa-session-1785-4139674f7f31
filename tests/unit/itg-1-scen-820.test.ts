import { calculateImpactScoreForLargeContracts } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-820: [edge] 営業担当者行動パターン分析機能 - 成約実績の金額が業務上の最大規模（例：1000万円以上）の場合、その成約実績の影響度を高優先度で計算する
  test('成約実績金額が1000万円以上の場合、優先度レベルがHIGHで影響度スコアが90以上となること', () => {
    const contract_amount = 15000000; // 1500万円
    const result = calculateImpactScoreForLargeContracts({
      contract_amount: contract_amount,
      contract_date: new Date('2024-01-15T10:00:00Z'),
      sales_rep_id: 'SR001',
    });

    expect(result.priority_level).toBe('HIGH');
    expect(result.impact_score).toBeGreaterThanOrEqual(90);
  });
});