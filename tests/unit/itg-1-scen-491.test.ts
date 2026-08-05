import { monitorAIInferenceAccuracyAndAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-491: [error] AIエージェント推論精度の自動監視とアラート機能 - 推論実行数が0の場合、エラーを返す
  test('推論実行数が0の場合、ステータスコード400とエラーメッセージ「推論実行数が0です。監視対象のデータが不足しています」を返す', () => {
    const input = {
      inference_execution_count: 0,
      monitoring_period_start: '2024-01-01T00:00:00Z',
      monitoring_period_end: '2024-01-31T23:59:59Z',
      accuracy_threshold: 95,
    };

    const result = monitorAIInferenceAccuracyAndAlert(input);

    expect(result.status_code).toBe(400);
    expect(result.error_code).toBe('INFERENCE_COUNT_ZERO');
    expect(result.error_message).toMatch(/推論実行数が0です。監視対象のデータが不足しています/);
  });
});