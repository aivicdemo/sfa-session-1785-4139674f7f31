import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-752
  test('[error] AIエージェント推論精度評価機能 - AIエージェント推論精度スコア算出時に推論ログ ID が空文字のときエラーになる', () => {
    const evaluation_period_start = '2024-01-01T00:00:00Z';
    const evaluation_period_end = '2024-01-31T23:59:59Z';
    const inference_model_name = 'sales_process_analyzer_v2';
    const empty_inference_log_id = '';

    expect(() =>
      calculateAiInferenceAccuracyScore({
        inference_log_id: empty_inference_log_id,
        evaluation_period_start: evaluation_period_start,
        evaluation_period_end: evaluation_period_end,
        inference_model_name: inference_model_name,
      })
    ).toThrow(/推論ログID/);
  });
});