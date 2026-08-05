import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { runTx10Imp1Agent } from '../../src/agents/tx-10-imp-1/orchestrator';
import type { Tx10Imp1AiClient } from '../../src/agents/tx-10-imp-1/orchestrator';

describe('tx-10-imp-1: 営業データ入力から問題検出・通知までの自律実行', () => {
  let mockAiClient: jest.Mocked<Tx10Imp1AiClient>;
  let auditEvents: Array<{
    timestamp: string;
    eventType: string;
    details: Record<string, unknown>;
  }>;

  beforeEach(() => {
    auditEvents = [];

    mockAiClient = {
      validateDataCompleteness: jest.fn().mockResolvedValue({
        is_valid: true,
        missing_fields: [],
        validation_score: 100,
      }),

      detectDuplicateAndContradictions: jest.fn().mockResolvedValue({
        has_duplicates: false,
        has_contradictions: false,
        duplicate_customer_ids: [],
        contradiction_details: [],
      }),

      analyzeProposalContent: jest.fn().mockResolvedValue({
        success_pattern_match_score: 85,
        proposal_quality_score: 88,
        matched_patterns: ['初回接触後_提案内容良好', '顧客ニーズ_適合度高'],
      }),

      detectInappropriatePatterns: jest.fn().mockResolvedValue({
        risk_factors: [
          {
            factor_type: 'constraint_violation',
            factor_name: '顧客購買制約違反',
            detected: true,
          },
        ],
        quality_deficiencies: [
          {
            deficiency_type: 'incomplete_proposal',
            deficiency_name: '提案資料不完全',
            detected: true,
          },
        ],
        inappropriate_patterns: [
          {
            pattern_type: 'improper_timing',
            pattern_name: 'フォローアップタイミング不適切',
            detected: false,
          },
        ],
      }),

      scoreDetectionResults: jest.fn().mockResolvedValue({
        constraint_violation_score: 75,
        quality_deficiency_score: 65,
        inappropriate_pattern_score: 40,
        overall_risk_score: 72,
      }),

      evaluateThresholdExceedance: jest.fn().mockResolvedValue({
        threshold_value: 70,
        actual_score: 72,
        exceeds_threshold: true,
        severity_level: 'medium',
      }),

      generateAlert: jest.fn().mockResolvedValue({
        alert_id: 'ALR-2024-001-TX10',
        inappropriate_pattern_type: 'constraint_violation',
        score_value: 72,
        detection_timestamp: '2024-01-15T11:30:00Z',
        sales_rep_id: 'SR-0042',
        customer_id: 'CUST-1234',
        alert_message: '顧客購買制約の違反と提案資料の不完全性が検出されました。',
        alert_severity: 'medium',
      }),

      recordAuditEvent: jest.fn().mockImplementation((event_type, details) => {
        auditEvents.push({
          timestamp: new Date().toISOString(),
          eventType: event_type,
          details: details,
        });
        return Promise.resolve();
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1280: [normal] 営業データ入力から問題検出・通知までの自律実行
  test('should execute autonomous workflow from data input through alert generation with score-based threshold evaluation', async () => {
    const input_sales_rep_id = 'SR-0042';
    const input_customer_id = 'CUST-1234';
    const input_proposal_content =
      '当社のクラウドERP導入により、在庫管理コスト削減を実現します。';
    const input_proposed_amount = 5000000;
    const input_customer_budget_limit = 3000000;
    const expected_threshold = 70;
    const expected_overall_risk_score = 72;
    const expected_alert_id = 'ALR-2024-001-TX10';
    const expected_detection_timestamp = '2024-01-15T11:30:00Z';
    const expected_alert_severity = 'medium';

    const result = await runTx10Imp1Agent(mockAiClient, {
      sales_rep_id: input_sales_rep_id,
      customer_id: input_customer_id,
      proposal_content: input_proposal_content,
      proposed_amount: input_proposed_amount,
      customer_budget_limit: input_customer_budget_limit,
    });

    // Step 1: Validate data completeness was called
    expect(mockAiClient.validateDataCompleteness).toHaveBeenCalledTimes(1);
    const completeness_call_args = (
      mockAiClient.validateDataCompleteness as jest.Mock
    ).mock.calls[0][0];
    expect(completeness_call_args).toHaveProperty('sales_rep_id', input_sales_rep_id);
    expect(completeness_call_args).toHaveProperty('customer_id', input_customer_id);
    expect(completeness_call_args).toHaveProperty('proposal_content', input_proposal_content);

    // Step 2: Detect duplicates and contradictions was called
    expect(mockAiClient.detectDuplicateAndContradictions).toHaveBeenCalledTimes(1);

    // Step 3: Analyze proposal content was called
    expect(mockAiClient.analyzeProposalContent).toHaveBeenCalledTimes(1);
    const proposal_analysis_call_args = (
      mockAiClient.analyzeProposalContent as jest.Mock
    ).mock.calls[0][0];
    expect(proposal_analysis_call_args).toHaveProperty('proposal_content', input_proposal_content);

    // Step 4: Detect inappropriate patterns was called
    expect(mockAiClient.detectInappropriatePatterns).toHaveBeenCalledTimes(1);
    const pattern_detection_call_args = (
      mockAiClient.detectInappropriatePatterns as jest.Mock
    ).mock.calls[0][0];
    expect(pattern_detection_call_args).toHaveProperty('sales_rep_id', input_sales_rep_id);

    // Step 5: Score detection results was called
    expect(mockAiClient.scoreDetectionResults).toHaveBeenCalledTimes(1);
    const score_call_args = (mockAiClient.scoreDetectionResults as jest.Mock).mock.calls[0][0];
    expect(score_call_args).toHaveProperty('risk_factors');
    expect(score_call_args).toHaveProperty('quality_deficiencies');
    expect(score_call_args).toHaveProperty('inappropriate_patterns');

    // Step 6: Evaluate threshold exceedance was called with correct threshold
    expect(mockAiClient.evaluateThresholdExceedance).toHaveBeenCalledTimes(1);
    const threshold_call_args = (
      mockAiClient.evaluateThresholdExceedance as jest.Mock
    ).mock.calls[0][0];
    expect(threshold_call_args).toHaveProperty('score_value', expected_overall_risk_score);
    expect(threshold_call_args).toHaveProperty('threshold_value', expected_threshold);

    // Step 7: Generate alert was called because threshold was exceeded
    expect(mockAiClient.generateAlert).toHaveBeenCalledTimes(1);
    const alert_call_args = (mockAiClient.generateAlert as jest.Mock).mock.calls[0][0];
    expect(alert_call_args).toHaveProperty('sales_rep_id', input_sales_rep_id);
    expect(alert_call_args).toHaveProperty('customer_id', input_customer_id);
    expect(alert_call_args).toHaveProperty('score_value', expected_overall_risk_score);

    // Step 8: Verify result contains alert information
    expect(result).toHaveProperty('alert_generated', true);
    expect(result).toHaveProperty('alert_id', expected_alert_id);
    expect(result).toHaveProperty('alert_score', expected_overall_risk_score);
    expect(result).toHaveProperty('threshold_exceeded', true);
    expect(result).toHaveProperty('alert_severity', expected_alert_severity);

    // Step 9: Verify alert contains required elements
    expect(result).toHaveProperty('inappropriate_pattern_type', 'constraint_violation');
    expect(result).toHaveProperty('detection_timestamp', expected_detection_timestamp);
    expect(result).toHaveProperty('sales_rep_id', input_sales_rep_id);
    expect(result).toHaveProperty('customer_id', input_customer_id);

    // Step 10: Verify audit events were recorded
    expect(mockAiClient.recordAuditEvent).toHaveBeenCalledTimes(6);

    const scoring_event = (mockAiClient.recordAuditEvent as jest.Mock).mock.calls[4];
    expect(scoring_event[0]).toBe('data_scoring_executed');
    expect(scoring_event[1]).toHaveProperty('score_value', expected_overall_risk_score);

    const alert_event = (mockAiClient.recordAuditEvent as jest.Mock).mock.calls[5];
    expect(alert_event[0]).toBe('alert_generated');
    expect(alert_event[1]).toHaveProperty('alert_id', expected_alert_id);
    expect(alert_event[1]).toHaveProperty('threshold_value', expected_threshold);

    // Step 11: Verify idempotent retry behavior - same input produces same alert
    const retry_result = await runTx10Imp1Agent(mockAiClient, {
      sales_rep_id: input_sales_rep_id,
      customer_id: input_customer_id,
      proposal_content: input_proposal_content,
      proposed_amount: input_proposed_amount,
      customer_budget_limit: input_customer_budget_limit,
    });

    expect(retry_result).toHaveProperty('alert_score', expected_overall_risk_score);
    expect(retry_result).toHaveProperty('alert_id', expected_alert_id);
    expect(retry_result.alert_id).toBe(result.alert_id);
    expect(retry_result.alert_score).toBe(result.alert_score);

    // Step 12: Verify rollback state is maintained
    expect(result).toHaveProperty('rollback_transaction_id');
    expect(result.rollback_transaction_id).toBeTruthy();
    expect(typeof result.rollback_transaction_id).toBe('string');
  });
});