import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-735
  test('問題検出結果が0件の状態での推論精度が適切に算出される', () => {
    const problem_detection_results: Array<{
      problem_id: string;
      severity: string;
      detection_score: number;
    }> = [];

    const system_logs: Array<{
      timestamp: string;
      level: string;
      message: string;
    }> = [];

    const mock_log_handler = (message: string) => {
      system_logs.push({
        timestamp: '2024-01-15T11:00:00Z',
        level: 'INFO',
        message,
      });
    };

    const inference_accuracy = calculateInferenceAccuracy(
      problem_detection_results,
      mock_log_handler
    );

    expect(inference_accuracy).toBe(0);
    expect(system_logs.length).toBe(1);
    expect(system_logs[0].message).toMatch(/問題検出0件での推論精度算出完了/);
    expect(system_logs[0].message).toMatch(/0%/);
  });
});