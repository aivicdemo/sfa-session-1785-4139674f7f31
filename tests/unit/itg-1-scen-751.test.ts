import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-751
  test('AIエージェント推論精度評価機能 - 営業管理職よりも権限が低いユーザーが実行時にエラーになる', () => {
    const user_id = 'user_sales_rep_001';
    const user_role = 'sales_representative';
    const inference_log_ids = ['log_001', 'log_002', 'log_003'];
    const evaluation_period_start = new Date('2024-01-01T00:00:00Z');
    const evaluation_period_end = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      calculateAiInferenceAccuracyScore({
        user_id,
        user_role,
        inference_log_ids,
        evaluation_period_start,
        evaluation_period_end,
      })
    ).toThrow(/権限/);
  });
});