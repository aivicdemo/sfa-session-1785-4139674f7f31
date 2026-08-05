import { validateInferenceReadiness } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-130: [error] AIエージェント推論実行前データ品質検証機能 - データ品質スコアがゼロのとき推論実行が保留される
  test('should suspend inference execution when data quality score is zero', () => {
    const input_dataset = {
      sales_activities: [
        {
          activity_id: 'ACT001',
          salesperson_id: 'SP001',
          customer_id: 'CUST001',
          activity_type: 'call',
          activity_date: '2024-01-15',
          notes: 'initial contact'
        }
      ],
      customers: [
        {
          customer_id: 'CUST001',
          customer_name: 'Acme Corp',
          industry: 'technology'
        }
      ]
    };

    const input_quality_check_result = {
      data_quality_score: 0,
      validation_timestamp: '2024-01-15T10:00:00Z',
      failed_validations: [
        'required_field_missing',
        'data_format_error',
        'business_rule_violation'
      ]
    };

    const input_model_config = {
      model_id: 'inference_v1',
      min_quality_score_threshold: 0.85,
      required_data_fields: ['activity_id', 'salesperson_id', 'customer_id'],
      inference_type: 'sales_pattern_analysis'
    };

    const result = validateInferenceReadiness(
      input_dataset,
      input_quality_check_result,
      input_model_config
    );

    expect(result.inference_status).toBe('SUSPENDED_QUALITY_CHECK_FAILED');
    expect(result.error_message).toBe(
      'Data quality score is 0. Inference execution is suspended until data quality improves.'
    );
    expect(result.inference_allowed).toBe(false);
    expect(result.inference_engine_invoked).toBe(false);
    expect(result.validation_details).toEqual({
      quality_score: 0,
      threshold: 0.85,
      failed_validations: [
        'required_field_missing',
        'data_format_error',
        'business_rule_violation'
      ]
    });
  });
});