import { validatePreInferenceData } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-103
  test('[edge] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データ量の最小要件が0件の場合、推論実行が許可される', () => {
    const min_required_training_data_count = 0;
    const training_dataset = [];
    const quality_score = 100;
    const quality_validation_result = {
      score: quality_score,
      status: 'normal',
    };

    const result = validatePreInferenceData({
      minimum_required_data_count: min_required_training_data_count,
      training_data: training_dataset,
      data_quality_validation: quality_validation_result,
    });

    expect(result).toBe(true);
  });
});