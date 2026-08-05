import { validateAndQueueInferenceBeforeQualityCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前データ品質検証機能', () => {
  test('SCEN-133: 品質検証ステータスが「失敗」のとき推論実行が保留される', () => {
    // Arrange
    const input_sales_process_data = {
      customer_id: 'CUST-2024-001',
      customer_name: 'テスト顧客',
      transaction_amount: 1500000,
      sales_stage: '提案',
      contact_date: '2024-01-15T10:00:00Z',
      responsible_sales_person_id: 'SP-2024-001',
    };

    const quality_validation_result = {
      validation_status: 'failed',
      validation_errors: [
        {
          field_name: 'contact_date',
          error_type: 'missing_value',
          error_message: '接触日時が欠損しています',
        },
        {
          field_name: 'customer_id',
          error_type: 'invalid_format',
          error_message: '顧客IDの形式が正しくありません',
        },
      ],
      quality_score: 62.5,
      quality_score_threshold: 80.0,
    };

    // Act
    const inference_execution_result = validateAndQueueInferenceBeforeQualityCheck(
      input_sales_process_data,
      quality_validation_result
    );

    // Assert
    expect(inference_execution_result.inference_execution_status).toBe('on_hold');
    expect(inference_execution_result.inference_queue_status).toBe('not_queued');
    expect(inference_execution_result.hold_reason_category).toBe(
      'data_quality_validation_failure'
    );
    expect(inference_execution_result.hold_reason_details).toContain(
      '欠損値検出'
    );
    expect(inference_execution_result.hold_reason_details).toContain(
      '形式不正'
    );
    expect(inference_execution_result.quality_score).toBe(62.5);
    expect(inference_execution_result.inference_queued_at).toBeNull();
    expect(Array.isArray(inference_execution_result.validation_error_list)).toBe(
      true
    );
    expect(inference_execution_result.validation_error_list.length).toBe(2);
  });
});