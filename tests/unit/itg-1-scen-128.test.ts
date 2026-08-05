import { validateAiInferencePrerequisites } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-128
  test('[error] AIエージェント推論実行前データ品質検証機能 - 最小要件を下回る学習データ量のとき推論実行が保留される', () => {
    const minimum_training_data_requirement = 10000;
    const actual_training_data_count = 9999;

    const request_payload = {
      training_data_count: actual_training_data_count,
      minimum_training_data_requirement: minimum_training_data_requirement,
      data_quality_score: 95,
      minimum_quality_score: 90,
    };

    const result = validateAiInferencePrerequisites(request_payload);

    expect(result.status).toBe('PENDING');
    expect(result.error_code).toBe('ERR_INSUFFICIENT_TRAINING_DATA');
    expect(result.message).toBe(
      `学習データ量が${actual_training_data_count}件であり、最小要件${minimum_training_data_requirement}件を満たしていません`
    );
    expect(result.inference_engine_started).toBe(false);
  });
});