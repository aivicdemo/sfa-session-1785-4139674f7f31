import { calculateCorrelationBetweenProcessAdherenceAndContractAmount } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-298: [edge] 行動パターン分析と改善指導優先順位判定機能 - 成約実績の累積金額が業務上の最大規模（例：999,999,999円）の場合、相関計算が正確に実行される
  test('cumulative_contract_amount_999999999_should_calculate_correlation_accurately', () => {
    const sales_person_id = 'SP001';
    const process_adherence_score = 85.5;
    const cumulative_contract_amount = 999999999;
    const improvement_priority_score_precision = 2;

    const result = calculateCorrelationBetweenProcessAdherenceAndContractAmount({
      sales_person_id,
      process_adherence_score,
      cumulative_contract_amount,
      improvement_priority_score_precision,
    });

    expect(result).toHaveProperty('correlation_coefficient');
    expect(result).toHaveProperty('priority_improvement_score');
    expect(result).toHaveProperty('is_valid_calculation');

    expect(typeof result.correlation_coefficient).toBe('number');
    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(1.0);

    expect(typeof result.priority_improvement_score).toBe('number');
    expect(result.priority_improvement_score).toBeGreaterThanOrEqual(0);
    expect(result.priority_improvement_score).toBeLessThanOrEqual(100);

    const decimal_places = (result.priority_improvement_score.toString().split('.')[1] || '').length;
    expect(decimal_places).toBeLessThanOrEqual(improvement_priority_score_precision);

    expect(result.is_valid_calculation).toBe(true);

    expect(Number.isFinite(result.correlation_coefficient)).toBe(true);
    expect(Number.isFinite(result.priority_improvement_score)).toBe(true);

    expect(result.sales_person_id).toBe(sales_person_id);
  });
});