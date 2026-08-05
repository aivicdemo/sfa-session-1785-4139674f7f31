import { determinePatternApplicability } from '../../src/logic/it-1-br-2-1-1';

describe('成功パターン適用判定機能', () => {
  // SCEN-404
  test('成約率が閾値未満の場合、そのパターンが適用不可と判定される', () => {
    const pattern = {
      pattern_id: 'success_pattern_001',
      customer_segment: 'enterprise',
      product_category: 'solution_a',
      success_count: 11,
      total_attempts: 20,
      win_rate: 0.55,
      applicability_threshold: 0.60,
      created_at: new Date('2024-01-01T00:00:00Z'),
    };

    const result = determinePatternApplicability(pattern);

    expect(result.applicable).toBe(false);
    expect(result.reasoning).toMatch(/成約率/);
    expect(result.reasoning).toMatch(/55%/);
    expect(result.reasoning).toMatch(/60%/);
    expect(result.reasoning).toMatch(/未満/);
    expect(result.reasoning).toMatch(/適用不可/);
  });
});