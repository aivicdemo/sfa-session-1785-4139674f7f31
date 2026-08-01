import { validateLearningDataQualityBeforeInference } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ量・品質検証機能', () => {
  // SCEN-100
  test('成約実績の品質スコアが良好ライン直上の場合、推論実行が許可される', () => {
    const input_learning_data_quality_score = 79.0;
    const expected_inference_permission_flag = true;
    const expected_status_code = 0;

    const result = validateLearningDataQualityBeforeInference({
      quality_score: input_learning_data_quality_score,
    });

    expect(result.inference_permission_flag).toBe(expected_inference_permission_flag);
    expect(result.status_code).toBe(expected_status_code);
  });
});