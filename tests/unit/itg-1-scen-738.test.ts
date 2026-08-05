import { calculateAiInferencePrecisionScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-738: [normal] AIエージェント推論精度評価機能 - 算出された推論精度スコアが管理職による信頼性判断に適した形式で提供される
  test('推論精度スコア（総合87、信頼区間82-92、信頼度レベル高）がJSON形式で正しく出力される', () => {
    const inference_result_dataset = {
      accuracy_rate: 0.85,
      confidence_score: 0.87,
      sample_count: 250,
    };

    const result = calculateAiInferencePrecisionScore(inference_result_dataset);

    expect(result).toEqual({
      overall_precision_score: 87,
      confidence_interval_lower: 82,
      confidence_interval_upper: 92,
      confidence_level: '高',
      inference_rationale_summary:
        '対象推論の正解率が基準値を上回り、サンプルサイズが統計的有意性を満たす',
    });
  });
});