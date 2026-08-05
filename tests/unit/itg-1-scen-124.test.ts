import { validateAiInferenceExecutionPrerequisites } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ・品質自動検証機能', () => {
  // SCEN-124
  test('学習データが最小要件を満たし品質が良好な状態で、推論実行指示が複数件のとき推論実行が許可される', () => {
    const training_data_count = 1500;
    const missing_value_rate = 3.5;
    const feature_statistical_significance = true;
    const quality_score = 85;
    const inference_requests_count = 3;

    const training_data_batch = Array.from({ length: training_data_count }, (_, i) => ({
      record_id: `train_${i + 1}`,
      features: {
        contact_frequency: Math.floor(Math.random() * 10) + 1,
        proposal_success_rate: Math.random() * 100,
        followup_interval_days: Math.floor(Math.random() * 30) + 1,
      },
      label: Math.random() > 0.5 ? 'success' : 'failure',
    }));

    const quality_validation_result = {
      data_count_valid: true,
      missing_value_rate_valid: true,
      feature_significance_valid: true,
      quality_score: quality_score,
    };

    const inference_requests = Array.from({ length: inference_requests_count }, (_, i) => ({
      inference_request_id: `infer_req_${i + 1}`,
      target_sales_person_ids: [`person_${i + 1}`],
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    }));

    const result = validateAiInferenceExecutionPrerequisites({
      training_data_batch: training_data_batch,
      quality_validation_result: quality_validation_result,
      inference_requests: inference_requests,
      minimum_data_count_threshold: 1000,
      maximum_missing_value_rate_threshold: 5.0,
      minimum_quality_score_threshold: 80,
    });

    expect(result.all_validations_passed).toBe(true);
    expect(result.data_count_check_passed).toBe(true);
    expect(result.missing_value_rate_check_passed).toBe(true);
    expect(result.feature_significance_check_passed).toBe(true);
    expect(result.quality_score).toBe(85);
    expect(result.inference_execution_permitted).toBe(true);
    expect(result.permitted_inference_request_count).toBe(3);
    expect(result.permitted_inference_request_ids).toEqual([
      'infer_req_1',
      'infer_req_2',
      'infer_req_3',
    ]);
  });
});