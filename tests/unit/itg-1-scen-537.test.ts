import { judgeProblemTimingCategory } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-537
  test('問題対応タイミングの判定機能 - 長期対応が必要な問題が検出された場合、対応時期として長期が指定される', () => {
    const problem_input = {
      problem_id: 'PROB-001',
      duration_days: 120,
      coordination_required: true,
      coordination_department_count: 3,
      resolution_difficulty: 'high',
      impact_scope: 'multiple',
      affected_records_count: 5000,
      created_at: '2024-01-01T08:00:00Z'
    };

    const result = judgeProblemTimingCategory(problem_input);

    expect(result.timing_category).toBe('long_term');
    expect(result.recommended_duration_days).toBeGreaterThanOrEqual(90);
    expect(result.expected_completion_date).toBeDefined();
    expect(typeof result.expected_completion_date).toBe('string');
  });
});