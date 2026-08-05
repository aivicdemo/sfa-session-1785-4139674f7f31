import { determineInferenceExecutionPermission } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ・品質自動検証機能', () => {
  // SCEN-125
  test('同じ学習データ・品質検証条件で推論実行判定を2回実行した場合、両回とも同じ許可結果が得られる', () => {
    // 検証条件の設定
    const validation_requirements = {
      min_sample_count: 1000,
      max_missing_value_rate: 0.05,
      max_outlier_count: 10,
    };

    // 合格状態の学習データセット
    const learning_dataset = {
      sample_count: 1500,
      missing_value_rate: 0.02,
      outlier_count: 5,
    };

    // 1回目の推論実行可否判定を実行
    const first_result = determineInferenceExecutionPermission(
      learning_dataset,
      validation_requirements
    );

    // 2回目の推論実行可否判定を実行
    const second_result = determineInferenceExecutionPermission(
      learning_dataset,
      validation_requirements
    );

    // 期待結果: 両回とも『許可』であり、同一の結果が得られること
    expect(first_result).toBe('permit');
    expect(second_result).toBe('permit');
    expect(first_result).toEqual(second_result);
  });
});