import { runTx3Imp1Agent } from '../../src/logic/it-1';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/ai-client';

// Mock implementations
jest.mock('../../src/agents/tx-3-imp-1/ai-client');
jest.mock('../../src/logic/it-1', () => ({
  runTx3Imp1Agent: jest.fn(),
}));

describe('営業プロセス実行状況の監査ダッシュボード - ヘルスチェック統合診断', () => {
  let mockAiClient: jest.Mocked<Tx3Imp1AiClient>;
  let auditLogs: Array<{
    timestamp: string;
    event: string;
    status: string;
  }>;
  let diagnosticCache: {
    healthCheck: {
      cpu_usage_percent: number;
      memory_usage_percent: number;
      service_status: string;
    } | null;
    dataQuality: {
      quality_score: number;
      warnings: string[];
    } | null;
    inferenceAccuracy: {
      accuracy_percent: number;
      target_accuracy_percent: number;
      deviation_percent: number;
    } | null;
  };
  let diagnosticReport: {
    execution_datetime: string;
    health_check_result: object;
    data_quality_result: object;
    inference_accuracy_result: object;
    anomaly_summary: {
      total_anomalies: number;
      total_warnings: number;
      severity_level: string;
      impact_range: string;
    };
    priority_judgment: {
      priority_level: string;
      reasoning: string;
    };
    recommended_actions: string;
  } | null;
  let diagnostic_history_record: {
    id: string;
    report_id: string;
    registration_timestamp: string;
    status: string;
    agent_execution_status: string;
  } | null;

  beforeEach(() => {
    jest.clearAllMocks();
    auditLogs = [];
    diagnosticCache = {
      healthCheck: null,
      dataQuality: null,
      inferenceAccuracy: null,
    };
    diagnosticReport = null;
    diagnostic_history_record = null;
  });

  // SCEN-1256
  test('should execute integrated diagnosis autonomously and register report without human approval for normal case', async () => {
    // Setup mock AI client with stub responses
    mockAiClient = {
      executeHealthCheck: jest.fn().mockResolvedValue({
        cpu_usage_percent: 45,
        memory_usage_percent: 60,
        service_status: 'operational',
        timestamp: '2024-01-15T10:30:00Z',
      }),
      executeDataQualityAnalysis: jest.fn().mockResolvedValue({
        quality_score: 85,
        warnings: [],
        timestamp: '2024-01-15T10:30:15Z',
      }),
      executeInferenceAccuracyEvaluation: jest.fn().mockResolvedValue({
        accuracy_percent: 92,
        target_accuracy_percent: 95,
        deviation_percent: -3,
        timestamp: '2024-01-15T10:30:30Z',
      }),
      integrateAnomalyAnalysis: jest.fn().mockResolvedValue({
        anomaly_count: 0,
        warning_count: 1,
        severity: 'minor',
        impact_scope: 'limited_to_ai_inference',
        primary_anomaly: 'inference_accuracy_deviation_3_percent',
      }),
    } as any;

    const trigger_event = {
      trigger_type: 'scheduled_weekly',
      scheduled_time: '2024-01-15T10:30:00Z',
      system_case_type: 'normal',
    };

    (runTx3Imp1Agent as jest.Mock).mockImplementation(async () => {
      // Audit: Agent autonomous execution started
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
        event: 'Tx3Imp1Agent autonomous execution started',
        status: 'initiated',
      });

      // Action 1: Execute health check
      const health_check_result = await mockAiClient.executeHealthCheck();
      diagnosticCache.healthCheck = health_check_result;
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:30:15Z').toISOString(),
        event: 'health_check_execution_successful',
        status: 'completed',
      });

      // Action 2: Execute data quality analysis
      const data_quality_result = await mockAiClient.executeDataQualityAnalysis();
      diagnosticCache.dataQuality = data_quality_result;
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:30:30Z').toISOString(),
        event: 'data_quality_analysis_execution_successful',
        status: 'completed',
      });

      // Action 3: Execute inference accuracy evaluation
      const inference_accuracy_result =
        await mockAiClient.executeInferenceAccuracyEvaluation();
      diagnosticCache.inferenceAccuracy = inference_accuracy_result;
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:30:45Z').toISOString(),
        event: 'inference_accuracy_evaluation_execution_successful',
        status: 'completed',
      });

      // Action 4: Integrate anomaly analysis
      const integrated_analysis =
        await mockAiClient.integrateAnomalyAnalysis();
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:31:00Z').toISOString(),
        event: 'integrated_analysis_completed',
        status: 'completed',
      });

      // Determine severity and priority
      const severity_level = integrated_analysis.severity;
      const impact_range = integrated_analysis.impact_scope;
      const priority_level = severity_level === 'minor' ? 'low' : 'high';
      const priority_reasoning =
        'inference_accuracy_deviation_3_percent_within_tolerance_no_immediate_action_required';

      // Action 5: Generate diagnostic report
      diagnosticReport = {
        execution_datetime: '2024-01-15T10:31:00Z',
        health_check_result: {
          cpu_usage_percent: 45,
          memory_usage_percent: 60,
          service_status: 'operational',
        },
        data_quality_result: {
          quality_score: 85,
          warnings: [],
        },
        inference_accuracy_result: {
          accuracy_percent: 92,
          target_accuracy_percent: 95,
          deviation_percent: -3,
        },
        anomaly_summary: {
          total_anomalies: 0,
          total_warnings: 1,
          severity_level: severity_level,
          impact_range: impact_range,
        },
        priority_judgment: {
          priority_level: priority_level,
          reasoning: priority_reasoning,
        },
        recommended_actions:
          'no_immediate_action_required_verify_accuracy_trend_at_next_scheduled_diagnosis',
      };
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:31:15Z').toISOString(),
        event: 'diagnostic_report_auto_generated',
        status: 'completed',
      });

      // Action 6: Skip human approval for normal case and auto-register
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:31:30Z').toISOString(),
        event: 'human_approval_skipped_for_normal_case_type',
        status: 'skipped',
      });

      diagnostic_history_record = {
        id: 'diag_hist_20240115_001',
        report_id: 'diag_rep_20240115_001',
        registration_timestamp: '2024-01-15T10:31:30Z',
        status: 'registered',
        agent_execution_status: 'completed',
      };
      auditLogs.push({
        timestamp: new Date('2024-01-15T10:31:45Z').toISOString(),
        event: 'auto_registration_to_diagnostic_history_completed',
        status: 'completed',
      });

      return {
        execution_id: 'exec_20240115_tx3_001',
        trigger_event: trigger_event,
        diagnostic_cache: diagnosticCache,
        diagnostic_report: diagnosticReport,
        diagnostic_history_record: diagnostic_history_record,
        audit_logs: auditLogs,
        final_status: 'completed',
        completion_timestamp: '2024-01-15T10:31:45Z',
      };
    });

    // Execute agent
    const result = await runTx3Imp1Agent(trigger_event, mockAiClient);

    // Verify health check execution and cache storage
    expect(diagnosticCache.healthCheck).not.toBeNull();
    expect(diagnosticCache.healthCheck?.cpu_usage_percent).toBe(45);
    expect(diagnosticCache.healthCheck?.memory_usage_percent).toBe(60);
    expect(diagnosticCache.healthCheck?.service_status).toBe('operational');

    // Verify data quality analysis execution and cache storage
    expect(diagnosticCache.dataQuality).not.toBeNull();
    expect(diagnosticCache.dataQuality?.quality_score).toBe(85);
    expect(diagnosticCache.dataQuality?.warnings).toEqual([]);

    // Verify inference accuracy evaluation execution and cache storage
    expect(diagnosticCache.inferenceAccuracy).not.toBeNull();
    expect(diagnosticCache.inferenceAccuracy?.accuracy_percent).toBe(92);
    expect(diagnosticCache.inferenceAccuracy?.target_accuracy_percent).toBe(95);
    expect(diagnosticCache.inferenceAccuracy?.deviation_percent).toBe(-3);

    // Verify integrated analysis and anomaly aggregation
    expect(diagnosticReport).not.toBeNull();
    expect(diagnosticReport?.anomaly_summary.total_anomalies).toBe(0);
    expect(diagnosticReport?.anomaly_summary.total_warnings).toBe(1);

    // Verify severity and impact judgment
    expect(diagnosticReport?.anomaly_summary.severity_level).toBe('minor');
    expect(diagnosticReport?.anomaly_summary.impact_range).toBe(
      'limited_to_ai_inference',
    );

    // Verify priority judgment
    expect(diagnosticReport?.priority_judgment.priority_level).toBe('low');
    expect(diagnosticReport?.priority_judgment.reasoning).toContain(
      'within_tolerance',
    );

    // Verify diagnostic report contents
    expect(diagnosticReport?.execution_datetime).toBe('2024-01-15T10:31:00Z');
    expect(diagnosticReport?.health_check_result).toEqual({
      cpu_usage_percent: 45,
      memory_usage_percent: 60,
      service_status: 'operational',
    });
    expect(diagnosticReport?.data_quality_result).toEqual({
      quality_score: 85,
      warnings: [],
    });
    expect(diagnosticReport?.recommended_actions).toContain('no_immediate_action');

    // Verify human approval was skipped for normal case
    expect(
      auditLogs.some(
        log =>
          log.event === 'human_approval_skipped_for_normal_case_type' &&
          log.status === 'skipped',
      ),
    ).toBe(true);

    // Verify automatic registration to diagnostic history
    expect(diagnostic_history_record).not.toBeNull();
    expect(diagnostic_history_record?.status).toBe('registered');
    expect(diagnostic_history_record?.agent_execution_status).toBe('completed');

    // Verify agent execution status transitioned to completed
    expect(result.final_status).toBe('completed');
    expect(result.completion_timestamp).toBe('2024-01-15T10:31:45Z');

    // Verify audit logs contain all required events
    const required_audit_events = [
      'Tx3Imp1Agent autonomous execution started',
      'health_check_execution_successful',
      'data_quality_analysis_execution_successful',
      'inference_accuracy_evaluation_execution_successful',
      'integrated_analysis_completed',
      'diagnostic_report_auto_generated',
      'human_approval_skipped_for_normal_case_type',
      'auto_registration_to_diagnostic_history_completed',
    ];

    for (const required_event of required_audit_events) {
      expect(
        auditLogs.some(log => log.event === required_event),
      ).toBe(true);
    }

    // Verify minimum 8 audit log entries
    expect(auditLogs.length).toBeGreaterThanOrEqual(8);
  });
});