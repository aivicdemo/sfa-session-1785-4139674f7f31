import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx12Imp1Agent } from '../../src/agents/tx-12-imp-1/orchestrator';
import type { Tx12Imp1AiClient } from '../../src/agents/tx-12-imp-1/ai-client';

// Mock AI client interface
const createMockTx12Imp1AiClient = (): Tx12Imp1AiClient => {
  return {
    extractDataByPeriod: jest.fn(),
    validateDataQuality: jest.fn(),
    analyzeActionPatterns: jest.fn(),
    calculateProcessDeviation: jest.fn(),
    analyzeCorrelationWithClosingResults: jest.fn(),
    generateAnalysisReport: jest.fn(),
  };
};

describe('営業プロセス標準書との乖離分析と成約実績の相関分析機能', () => {
  let mock_ai_client: Tx12Imp1AiClient;

  beforeEach(() => {
    mock_ai_client = createMockTx12Imp1AiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1209
  test('プロセス実行度が標準比100%のときの相関係数が0.0として計算される', async () => {
    // Prepare test dataset with all process execution at 100%
    const sales_rep_id_a = 'sales_rep_001';
    const sales_rep_id_b = 'sales_rep_002';
    const sales_rep_id_c = 'sales_rep_003';
    const period_start = '2024-01-01';
    const period_end = '2024-01-31';

    // Dataset: Process execution 100% for all, but different closing rates
    const extracted_data = {
      period_start,
      period_end,
      sales_reps: [
        {
          sales_rep_id: sales_rep_id_a,
          total_deals: 10,
          process_execution_degree: 100,
          closing_rate: 50,
          closing_count: 5,
        },
        {
          sales_rep_id: sales_rep_id_b,
          total_deals: 10,
          process_execution_degree: 100,
          closing_rate: 80,
          closing_count: 8,
        },
        {
          sales_rep_id: sales_rep_id_c,
          total_deals: 10,
          process_execution_degree: 100,
          closing_rate: 30,
          closing_count: 3,
        },
      ],
      record_count: 30,
    };

    const quality_check_result = {
      data_quality_score: 98,
      missing_fields_count: 0,
      format_errors_count: 0,
      duplicate_detections: 0,
      is_passed: true,
    };

    const action_pattern_analysis = {
      sales_rep_patterns: [
        {
          sales_rep_id: sales_rep_id_a,
          initial_contact_frequency: 8,
          proposal_success_rate: 60,
          followup_interval_days: 5,
        },
        {
          sales_rep_id: sales_rep_id_b,
          initial_contact_frequency: 12,
          proposal_success_rate: 85,
          followup_interval_days: 3,
        },
        {
          sales_rep_id: sales_rep_id_c,
          initial_contact_frequency: 6,
          proposal_success_rate: 40,
          followup_interval_days: 7,
        },
      ],
    };

    const process_deviation_result = {
      step_name_initial_contact: {
        sales_rep_id_a: 100,
        sales_rep_id_b: 100,
        sales_rep_id_c: 100,
      },
      step_name_needs_survey: {
        sales_rep_id_a: 100,
        sales_rep_id_b: 100,
        sales_rep_id_c: 100,
      },
      step_name_proposal: {
        sales_rep_id_a: 100,
        sales_rep_id_b: 100,
        sales_rep_id_c: 100,
      },
      step_name_closing: {
        sales_rep_id_a: 100,
        sales_rep_id_b: 100,
        sales_rep_id_c: 100,
      },
      overall_process_execution_degree: {
        sales_rep_id_a: 100,
        sales_rep_id_b: 100,
        sales_rep_id_c: 100,
      },
      deviation_by_rep: [
        { sales_rep_id: sales_rep_id_a, deviation_percent: 0 },
        { sales_rep_id: sales_rep_id_b, deviation_percent: 0 },
        { sales_rep_id: sales_rep_id_c, deviation_percent: 0 },
      ],
    };

    // Correlation analysis: when process execution is 100% for all (zero variance),
    // correlation coefficient should be normalized to 0.0
    const correlation_dataset = [
      {
        sales_rep_id: sales_rep_id_a,
        process_execution_degree: 100,
        closing_rate: 50,
      },
      {
        sales_rep_id: sales_rep_id_b,
        process_execution_degree: 100,
        closing_rate: 80,
      },
      {
        sales_rep_id: sales_rep_id_c,
        process_execution_degree: 100,
        closing_rate: 30,
      },
    ];

    // Calculate statistics for audit trail
    const process_execution_values = correlation_dataset.map(
      (d) => d.process_execution_degree
    );
    const closing_rate_values = correlation_dataset.map((d) => d.closing_rate);

    const process_execution_variance = 0.0; // All values are 100, so variance is 0
    const closing_rate_mean =
      closing_rate_values.reduce((a, b) => a + b, 0) / closing_rate_values.length;
    const closing_rate_std_dev = Math.sqrt(
      closing_rate_values.reduce((sum, val) => sum + Math.pow(val - closing_rate_mean, 2), 0) /
        closing_rate_values.length
    );

    const correlation_analysis_result = {
      correlation_coefficient: 0.0,
      sample_count: 3,
      process_execution_variance,
      closing_rate_mean: closing_rate_mean,
      closing_rate_std_dev: closing_rate_std_dev,
      is_normalized: true,
      normalization_reason:
        'プロセス実行度の分散がゼロであるため相関係数を0.0で正規化',
    };

    const audit_trail = {
      calculation_timestamp: '2024-01-31T23:59:59Z',
      dataset_sample_count: 3,
      process_execution_variance: 0.0,
      closing_rate_mean: closing_rate_mean,
      closing_rate_std_dev: closing_rate_std_dev,
      normalization_applied: true,
      normalization_reason:
        'プロセス実行度の分散がゼロであるため相関係数を0.0で正規化',
      variance_threshold: 0.01,
    };

    const final_report = {
      report_id: 'report_20240131_001',
      generated_at: '2024-01-31T23:59:59Z',
      period_start,
      period_end,
      data_quality_score: quality_check_result.data_quality_score,
      process_deviation_summary: process_deviation_result,
      correlation_analysis_result,
      dataset_audit_trail: audit_trail,
      analysis_conclusion:
        'プロセス実行度が全営業担当者で100%達成されている状態。プロセス実行度の変動がないため、成約実績との相関係数は数学的に定義不可となり、0.0として正規化している。',
    };

    // Mock AI client methods
    (mock_ai_client.extractDataByPeriod as jest.Mock).mockResolvedValue(extracted_data);
    (mock_ai_client.validateDataQuality as jest.Mock).mockResolvedValue(
      quality_check_result
    );
    (mock_ai_client.analyzeActionPatterns as jest.Mock).mockResolvedValue(
      action_pattern_analysis
    );
    (mock_ai_client.calculateProcessDeviation as jest.Mock).mockResolvedValue(
      process_deviation_result
    );
    (mock_ai_client.analyzeCorrelationWithClosingResults as jest.Mock).mockResolvedValue(
      correlation_analysis_result
    );
    (mock_ai_client.generateAnalysisReport as jest.Mock).mockResolvedValue(
      final_report
    );

    // Execute: trigger monthly sales meeting and run analysis
    const trigger_type = 'monthly_sales_meeting';
    const report = await runTx12Imp1Agent(
      {
        trigger_type,
        period_start,
        period_end,
      },
      mock_ai_client
    );

    // Verify: correlation analysis result
    expect(report.correlation_analysis_result.correlation_coefficient).toBe(0.0);
    expect(report.correlation_analysis_result.sample_count).toBe(3);
    expect(report.correlation_analysis_result.process_execution_variance).toBe(0.0);
    expect(report.correlation_analysis_result.is_normalized).toBe(true);
    expect(report.correlation_analysis_result.normalization_reason).toMatch(
      /分散がゼロ/
    );

    // Verify: audit trail contains required fields
    expect(report.dataset_audit_trail.dataset_sample_count).toBe(3);
    expect(report.dataset_audit_trail.process_execution_variance).toBe(0.0);
    expect(report.dataset_audit_trail.normalization_applied).toBe(true);
    expect(report.dataset_audit_trail.normalization_reason).toMatch(
      /分散がゼロであるため/
    );

    // Verify: closing rate statistics are recorded
    expect(report.dataset_audit_trail.closing_rate_mean).toBe(closing_rate_mean);
    expect(report.dataset_audit_trail.closing_rate_std_dev).toBeCloseTo(
      closing_rate_std_dev,
      5
    );

    // Verify: report generation completed successfully
    expect(report.report_id).toBeDefined();
    expect(report.generated_at).toBeDefined();
    expect(report.period_start).toBe(period_start);
    expect(report.period_end).toBe(period_end);
    expect(report.data_quality_score).toBe(98);

    // Verify: AI client methods were called in correct sequence
    expect(mock_ai_client.extractDataByPeriod).toHaveBeenCalledWith(
      period_start,
      period_end
    );
    expect(mock_ai_client.validateDataQuality).toHaveBeenCalled();
    expect(mock_ai_client.analyzeActionPatterns).toHaveBeenCalled();
    expect(mock_ai_client.calculateProcessDeviation).toHaveBeenCalled();
    expect(mock_ai_client.analyzeCorrelationWithClosingResults).toHaveBeenCalled();
    expect(mock_ai_client.generateAnalysisReport).toHaveBeenCalled();
  });
});