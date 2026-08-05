import { calculateAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-530
  test('[normal] AIエージェント推論ログが存在する場合、推論精度が正確に計算される', () => {
    const inference_logs = [
      {
        inference_id: 'INF-001',
        result: '正解',
        confidence: 0.95,
      },
      {
        inference_id: 'INF-002',
        result: '正解',
        confidence: 0.87,
      },
      {
        inference_id: 'INF-003',
        result: '不正解',
        confidence: 0.62,
      },
    ];

    const time_window_hours = 24;

    const actual_result = calculateAiInferenceAccuracy(
      inference_logs,
      time_window_hours
    );

    const expected_correct_count = 2;
    const expected_total_count = 3;
    const expected_accuracy_percentage = 66.67;
    const expected_average_confidence = 0.813;

    expect(actual_result.correct_count).toBe(expected_correct_count);
    expect(actual_result.total_count).toBe(expected_total_count);
    expect(actual_result.accuracy_percentage).toBeCloseTo(
      expected_accuracy_percentage,
      2
    );
    expect(actual_result.average_confidence).toBeCloseTo(
      expected_average_confidence,
      3
    );
  });
});