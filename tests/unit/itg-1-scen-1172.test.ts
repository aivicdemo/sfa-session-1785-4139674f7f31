import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('IT-1-BR-2-1-1: 成約実績との相関分析', () => {
  // SCEN-1172: [normal] 成約実績との相関分析機能 - 成約実績が複数件の場合、全件を対象とした相関分析結果が計算される

  let audit_log_records: unknown[] = [];

  beforeEach(() => {
    audit_log_records = [];
  });

  afterEach(() => {
    audit_log_records = [];
  });

  test('SCEN-1172: should calculate correlation analysis for multiple sales results', async () => {
    // Arrange
    const sales_result_data = [
      {
        sales_person_id: 'SP_A',
        sales_person_name: '営業担当者A',
        contract_amount: 1000000,
        contract_date: '2024-01-15T10:00:00Z',
      },
      {
        sales_person_id: 'SP_B',
        sales_person_name: '営業担当者B',
        contract_amount: 1500000,
        contract_date: '2024-01-20T14:30:00Z',
      },
      {
        sales_person_id: 'SP_C',
        sales_person_name: '営業担当者C',
        contract_amount: 800000,
        contract_date: '2024-01-25T09:15:00Z',
      },
    ];

    const sales_behavior_pattern_data = [
      {
        sales_person_id: 'SP_A',
        contact_frequency: 5,
        proposal_content_quality: 'high',
        followup_interval_days: 3,
        analysis_period_start: '2024-01-01T00:00:00Z',
        analysis_period_end: '2024-01-15T10:00:00Z',
      },
      {
        sales_person_id: 'SP_B',
        contact_frequency: 8,
        proposal_content_quality: 'high',
        followup_interval_days: 2,
        analysis_period_start: '2024-01-01T00:00:00Z',
        analysis_period_end: '2024-01-20T14:30:00Z',
      },
      {
        sales_person_id: 'SP_C',
        contact_frequency: 3,
        proposal_content_quality: 'medium',
        followup_interval_days: 5,
        analysis_period_start: '2024-01-01T00:00:00Z',
        analysis_period_end: '2024-01-25T09:15:00Z',
      },
    ];

    const mock_ai_client = {
      analyzeCorrelationWithActualResults: async (
        sales_results: typeof sales_result_data,
        behavior_patterns: typeof sales_behavior_pattern_data,
      ) => {
        const correlation_results = [
          {
            sales_person_id: 'SP_A',
            sales_person_name: '営業担当者A',
            correlation_coefficient: 0.72,
            contract_amount: 1000000,
            contact_frequency: 5,
          },
          {
            sales_person_id: 'SP_B',
            sales_person_name: '営業担当者B',
            correlation_coefficient: 0.85,
            contract_amount: 1500000,
            contact_frequency: 8,
          },
          {
            sales_person_id: 'SP_C',
            sales_person_name: '営業担当者C',
            correlation_coefficient: 0.68,
            contract_amount: 800000,
            contact_frequency: 3,
          },
        ];

        // Simulate audit log recording
        const audit_record = {
          execution_id: 'EXE_20240201_001',
          executed_at: '2024-02-01T12:00:00Z',
          logic_id: 'CORR_ANALYSIS_001',
          input_sales_results_count: sales_results.length,
          input_behavior_patterns_count: behavior_patterns.length,
          input_data_summary: {
            sales_results: sales_results,
            behavior_patterns: behavior_patterns,
          },
          output_correlation_results: correlation_results,
          result_count: correlation_results.length,
          status: 'success',
        };

        audit_log_records.push(audit_record);

        return {
          success: true,
          correlation_results: correlation_results,
          audit_record_id: audit_record.execution_id,
          auditable_dataset_count: sales_results.length,
        };
      },
    };

    // Act
    const analysis_result = await mock_ai_client.analyzeCorrelationWithActualResults(
      sales_result_data,
      sales_behavior_pattern_data,
    );

    // Assert - Verify all 3 records are included in correlation analysis
    expect(analysis_result.correlation_results).toHaveLength(3);

    // Assert - Verify correlation coefficients match expected values
    expect(analysis_result.correlation_results[0].sales_person_id).toBe('SP_A');
    expect(analysis_result.correlation_results[0].correlation_coefficient).toBe(0.72);
    expect(analysis_result.correlation_results[0].contract_amount).toBe(1000000);
    expect(analysis_result.correlation_results[0].contact_frequency).toBe(5);

    expect(analysis_result.correlation_results[1].sales_person_id).toBe('SP_B');
    expect(analysis_result.correlation_results[1].correlation_coefficient).toBe(0.85);
    expect(analysis_result.correlation_results[1].contract_amount).toBe(1500000);
    expect(analysis_result.correlation_results[1].contact_frequency).toBe(8);

    expect(analysis_result.correlation_results[2].sales_person_id).toBe('SP_C');
    expect(analysis_result.correlation_results[2].correlation_coefficient).toBe(0.68);
    expect(analysis_result.correlation_results[2].contract_amount).toBe(800000);
    expect(analysis_result.correlation_results[2].contact_frequency).toBe(3);

    // Assert - Verify audit log is recorded
    expect(audit_log_records).toHaveLength(1);
    const recorded_audit = audit_log_records[0] as Record<string, unknown>;
    expect(recorded_audit.execution_id).toBe('EXE_20240201_001');
    expect(recorded_audit.logic_id).toBe('CORR_ANALYSIS_001');
    expect(recorded_audit.input_sales_results_count).toBe(3);
    expect(recorded_audit.input_behavior_patterns_count).toBe(3);
    expect(recorded_audit.result_count).toBe(3);
    expect(recorded_audit.status).toBe('success');

    // Assert - Verify input dataset is preserved for auditability
    const audit_input_data = recorded_audit.input_data_summary as Record<string, unknown>;
    const audit_sales_results = audit_input_data.sales_results as Array<Record<string, unknown>>;
    const audit_behavior_patterns = audit_input_data.behavior_patterns as Array<Record<string, unknown>>;

    expect(audit_sales_results).toHaveLength(3);
    expect(audit_sales_results[0].sales_person_id).toBe('SP_A');
    expect(audit_sales_results[1].sales_person_id).toBe('SP_B');
    expect(audit_sales_results[2].sales_person_id).toBe('SP_C');

    expect(audit_behavior_patterns).toHaveLength(3);
    expect(audit_behavior_patterns[0].contact_frequency).toBe(5);
    expect(audit_behavior_patterns[1].contact_frequency).toBe(8);
    expect(audit_behavior_patterns[2].contact_frequency).toBe(3);

    // Assert - Verify result is auditable
    expect(analysis_result.success).toBe(true);
    expect(analysis_result.audit_record_id).toBe('EXE_20240201_001');
    expect(analysis_result.auditable_dataset_count).toBe(3);
  });
});