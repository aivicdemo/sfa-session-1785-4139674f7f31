import { calculateSalesPerformanceMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-211: [edge] 営業担当者行動パターン分析・改善指導対象判定機能 - 成約実績の金額が業務上の最大規模である場合、オーバーフローなく計算される
  test('成約実績金額が最大規模（9,999,999,999円）の場合、オーバーフロー例外なく判定結果を返却する', () => {
    const max_contract_amount = 9999999999;
    const sales_person_id = 'SP001';
    const target_amount = 5000000000;
    const contract_count = 12;
    const analysis_period_months = 12;

    const result = calculateSalesPerformanceMetrics({
      sales_person_id: sales_person_id,
      contract_amount: max_contract_amount,
      target_amount: target_amount,
      contract_count: contract_count,
      analysis_period_months: analysis_period_months,
    });

    expect(result).toHaveProperty('cumulative_sales_amount');
    expect(result).toHaveProperty('achievement_rate');
    expect(result).toHaveProperty('improvement_target_flag');
    expect(result).toHaveProperty('analysis_score');

    expect(typeof result.cumulative_sales_amount).toBe('number');
    expect(typeof result.achievement_rate).toBe('number');
    expect(typeof result.improvement_target_flag).toBe('boolean');
    expect(typeof result.analysis_score).toBe('number');

    expect(Number.isFinite(result.cumulative_sales_amount)).toBe(true);
    expect(Number.isFinite(result.achievement_rate)).toBe(true);
    expect(Number.isFinite(result.analysis_score)).toBe(true);

    expect(isNaN(result.cumulative_sales_amount)).toBe(false);
    expect(isNaN(result.achievement_rate)).toBe(false);
    expect(isNaN(result.analysis_score)).toBe(false);

    expect(result.cumulative_sales_amount).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    expect(result.achievement_rate).toBeLessThanOrEqual(1000);
    expect(result.analysis_score).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);

    const expected_achievement_rate = (max_contract_amount / target_amount) * 100;
    expect(result.achievement_rate).toBeCloseTo(expected_achievement_rate, 2);

    const expected_monthly_average = max_contract_amount / analysis_period_months;
    expect(expected_monthly_average).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  });
});