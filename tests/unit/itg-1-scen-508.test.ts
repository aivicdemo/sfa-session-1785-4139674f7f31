import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-508
  test('[edge] AIエージェント推論精度スコア算出機能 - 精度スコアの算出対象期間が月初を含む場合、正しく計算される', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    const end_date = new Date('2024-01-15T23:59:59Z');

    const inference_results = Array.from({ length: 20 }, (_, index) => ({
      task_id: `task_${index + 1}`,
      executed_at: new Date(
        new Date('2024-01-01T00:00:00Z').getTime() + index * 86400000
      ),
      is_correct: index < 16,
    }));

    const accuracy_score = calculateInferenceAccuracyScore(
      start_date,
      end_date,
      inference_results
    );

    expect(accuracy_score).toBe(80.0);
  });
});