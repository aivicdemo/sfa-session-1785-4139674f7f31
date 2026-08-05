import { canExecuteAiInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行可否判定機能', () => {
  // SCEN-154
  test('データ品質スコアが許容下限をちょうど満たすとき推論実行が許可される', () => {
    const quality_score_minimum_threshold = 60;
    const test_quality_score = 60;

    const sales_process_data = {
      quality_score: test_quality_score,
      data_volume: 1000,
      validation_passed: true,
      period_start: '2024-01-01',
      period_end: '2024-01-31',
    };

    const result = canExecuteAiInference(sales_process_data);

    expect(result.can_execute).toBe(true);
    expect(result.decision_reason).toMatch(/60/);
    expect(result.decision_reason).toMatch(/許容下限値/);
  });
});