import { validateInferenceLog } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-566: 推論実行日時が欠落している場合、バリデーションエラーがスローされる', () => {
    const inference_log_with_null_executed_at = {
      inference_log_id: 'log_20240115_001',
      agent_id: 'agent_sales_001',
      inference_request_id: 'req_20240115_001',
      executed_at: null,
      inference_type: 'proposal_pattern_analysis',
      input_data: {
        salesperson_id: 'sp_001',
        customer_id: 'cust_001',
        proposal_content: 'Product A bundle with discount',
      },
      output_result: {
        success_probability: 0.85,
        recommended_approach: 'follow_up_via_email',
        confidence_score: 0.92,
      },
      inference_duration_ms: 1250,
      model_version: 'v2.3.1',
      created_at: new Date('2024-01-15T10:30:00Z'),
    };

    expect(() => validateInferenceLog(inference_log_with_null_executed_at)).toThrow(/推論実行日時は必須項目です/);
  });
});