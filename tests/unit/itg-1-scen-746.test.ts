import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-746: [error] AIエージェント推論精度評価機能 - AIエージェント推論精度スコア算出時に問題検出結果が空配列のときエラーになる
  test('should throw error with empty problem detection results', () => {
    const empty_problem_detection_results: Array<{
      problem_id: string;
      severity: string;
      confidence: number;
    }> = [];

    expect(() =>
      calculateInferenceAccuracyScore({
        problem_detection_results: empty_problem_detection_results,
        total_inference_count: 100,
        correct_inference_count: 95,
        inference_execution_date: new Date('2024-01-15T11:00:00Z'),
      })
    ).toThrow(/問題検出結果が空/);
  });
});