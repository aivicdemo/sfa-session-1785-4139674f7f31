import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-363: [edge] システムヘルスチェック結果レポート生成機能 - 推論精度スコアの端数が発生する場合に適切に丸められてレポートに反映される
  test('推論精度スコア85.3567%が85.36%に小数点第2位で四捨五入されてレポートに反映される', () => {
    const raw_inference_accuracy_score = 85.3567;
    const health_check_result = {
      inference_accuracy_score: raw_inference_accuracy_score,
      inference_correct_count: 1707,
      inference_total_count: 2000,
      evaluation_timestamp: '2024-01-15T11:00:00Z',
    };

    const report_inference_accuracy_score = calculateInferenceAccuracyScore(
      health_check_result.inference_correct_count,
      health_check_result.inference_total_count
    );

    expect(report_inference_accuracy_score).toBe(85.36);
  });
});