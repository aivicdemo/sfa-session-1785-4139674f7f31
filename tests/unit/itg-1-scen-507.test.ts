import { calculateAIInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-507: 精度スコア算出機能 - 月末を含む期間での計算', () => {
    const start_date = new Date('2024-01-15T00:00:00Z');
    const end_date = new Date('2024-01-31T23:59:59Z');
    const correct_count = 42;
    const total_count = 50;

    const result = calculateAIInferenceAccuracyScore({
      start_date,
      end_date,
      correct_inference_count: correct_count,
      total_inference_count: total_count,
    });

    expect(result.accuracy_score).toBe(84.0);
    expect(result.target_period_start).toEqual(start_date);
    expect(result.target_period_end).toEqual(end_date);
  });
});