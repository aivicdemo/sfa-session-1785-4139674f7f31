import { describe, test, expect } from '@jest/globals';
import { calculateDeviationAndClosureCorrelation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-321
  test('営業担当者複数名のデータから乖離度と成約実績の相関が計算される', () => {
    const sales_staff_data = [
      {
        staff_id: 'A001',
        customer_count: 10,
        proposal_count: 8,
        closure_count: 6,
        deviation_score: 0.15,
      },
      {
        staff_id: 'B002',
        customer_count: 12,
        proposal_count: 10,
        closure_count: 7,
        deviation_score: 0.35,
      },
      {
        staff_id: 'C003',
        customer_count: 15,
        proposal_count: 14,
        closure_count: 11,
        deviation_score: 0.05,
      },
    ];

    const result = calculateDeviationAndClosureCorrelation(sales_staff_data);

    expect(typeof result.correlation_coefficient).toBe('number');
    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(1.0);
    expect(result.correlation_coefficient).toBeCloseTo(-0.72, 1);
    expect(result.sample_size).toBe(3);
    expect(Array.isArray(result.staff_closure_rates)).toBe(true);
    expect(result.staff_closure_rates.length).toBe(3);
  });
});