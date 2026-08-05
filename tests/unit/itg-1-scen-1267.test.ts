import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/logic/it-1';

// Mock AI client interface
interface MockAiClientResponse {
  type: 'health_check' | 'data_quality' | 'inference_accuracy';
  status: 'success' | 'error';
  data?: Record<string, unknown>;
  error?: string;
}

interface FakeTx3Imp1AiClient {
  executeHealthCheck: jest.Mock<Promise<MockAiClientResponse>>;
  executeDataQualityAnalysis: jest.Mock<Promise<MockAiClientResponse>>;
  executeInferenceAccuracyEvaluation: jest.Mock<Promise<MockAiClientResponse>>;
}

const createFakeTx3Imp1AiClient = (): FakeTx3Imp1AiClient => ({
  executeHealthCheck: jest.fn(),
  executeDataQualityAnalysis: jest.fn(),
  executeInferenceAccuracyEvaluation: jest.fn(),
});

describe('tx-3-imp-1: ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行', () => {
  let fakeAiClient: FakeTx3Imp1AiClient;
  let auditLogEvents: Array<{
    event_type: string;
    escalation_reason?: string;
    timestamp: string;
  }>;
  let autoRemediationActions: Array<{
    action_type: string;
    executed_at: string;
  }>;

  beforeEach(() => {
    fakeAiClient = createFakeTx3Imp1AiClient();
    auditLogEvents = [];
    autoRemediationActions = [];

    // Mock health check: critical system failure
    fakeAiClient.executeHealthCheck.mockResolvedValueOnce({
      type: 'health_check',
      status: 'success',
      data: {
        system_status: 'CRITICAL_FAILURE',
        affected_components: ['database_connection', 'api_gateway'],
        detected_at: '2024-01-15T10:30:00Z',
      },
    });

    // Mock data quality analysis: score 30% (threshold 50%)
    fakeAiClient.executeDataQualityAnalysis.mockResolvedValueOnce({
      type: 'data_quality',
      status: 'success',
      data: {
        quality_score: 30,
        quality_threshold: 50,
        issues: [
          { field: 'customer_id', error_rate: 0.25 },
          { field: 'transaction_date', error_rate: 0.18 },
          { field: 'proposal_amount', error_rate: 0.12 },
        ],
        detected_at: '2024-01-15T10:30:00Z',
      },
    });

    // Mock inference accuracy: 15% drop (threshold: 10% drop from target)
    fakeAiClient.executeInferenceAccuracyEvaluation.mockResolvedValueOnce({
      type: 'inference_accuracy',
      status: 'success',
      data: {
        current_accuracy: 80,
        target_accuracy: 95,
        accuracy_drop_percentage: 15,
        accuracy_drop_threshold: 10,
        model_performance_trend: 'DEGRADING',
        detected_at: '2024-01-15T10:30:00Z',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1267
  test('複数領域で同時に異常が発生した場合、副作用確定前に人へ引き継ぐ', async () => {
    const trigger_timestamp = '2024-01-15T10:30:00Z';
    const trigger_type = 'SCHEDULED_WEEKLY';

    const result = await runTx3Imp1Agent(
      {
        trigger_type,
        trigger_timestamp,
        ai_client: fakeAiClient as any,
        audit_log_sink: (event: {
          event_type: string;
          escalation_reason?: string;
          timestamp: string;
        }) => {
          auditLogEvents.push(event);
        },
        auto_remediation_sink: (action: {
          action_type: string;
          executed_at: string;
        }) => {
          autoRemediationActions.push(action);
        },
      },
    );

    // Step 1: Verify system health check diagnostic was executed
    expect(fakeAiClient.executeHealthCheck).toHaveBeenCalled();
    const health_check_call = await fakeAiClient.executeHealthCheck();
    expect(health_check_call.data?.system_status).toBe('CRITICAL_FAILURE');

    // Step 2: Verify data quality analysis was executed
    expect(fakeAiClient.executeDataQualityAnalysis).toHaveBeenCalled();
    const data_quality_call = await fakeAiClient.executeDataQualityAnalysis();
    expect(data_quality_call.data?.quality_score).toBe(30);
    expect(data_quality_call.data?.quality_threshold).toBe(50);

    // Step 3: Verify inference accuracy evaluation was executed
    expect(fakeAiClient.executeInferenceAccuracyEvaluation).toHaveBeenCalled();
    const inference_call =
      await fakeAiClient.executeInferenceAccuracyEvaluation();
    expect(inference_call.data?.accuracy_drop_percentage).toBe(15);
    expect(inference_call.data?.accuracy_drop_threshold).toBe(10);

    // Step 4: Verify escalation condition matched
    expect(result.escalation_required).toBe(true);
    expect(result.escalation_condition_type).toBe(
      'MULTIPLE_DOMAINS_SIMULTANEOUS_ANOMALY',
    );

    // Step 5: Verify handoff to human before side effects
    expect(result.handoff_required).toBe(true);

    // Step 6: Verify handoff response contains required fields
    expect(result.human_review_details).toBeDefined();
    const handoff = result.human_review_details;
    expect(handoff.escalation_status).toBe('AWAITING_HUMAN_REVIEW');
    expect(Array.isArray(handoff.affected_domains)).toBe(true);
    expect(handoff.affected_domains).toContain('SYSTEM_HEALTH');
    expect(handoff.affected_domains).toContain('DATA_QUALITY');
    expect(handoff.affected_domains).toContain('INFERENCE_ACCURACY');
    expect(handoff.affected_domains.length).toBe(3);
    expect(handoff.severity_level).toBe('CRITICAL');

    // Step 7: Verify ISO 8601 format of handoff_timestamp
    expect(typeof handoff.handoff_timestamp).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(handoff.handoff_timestamp)).toBe(
      true,
    );

    // Step 8: Verify aggregated_anomalies contains all 3 domains
    expect(handoff.aggregated_anomalies).toBeDefined();
    expect(Array.isArray(handoff.aggregated_anomalies)).toBe(true);
    expect(handoff.aggregated_anomalies.length).toBe(3);

    const health_anomaly = handoff.aggregated_anomalies.find(
      (a: any) => a.domain === 'SYSTEM_HEALTH',
    );
    expect(health_anomaly).toBeDefined();
    expect(health_anomaly.status).toBe('CRITICAL_FAILURE');

    const quality_anomaly = handoff.aggregated_anomalies.find(
      (a: any) => a.domain === 'DATA_QUALITY',
    );
    expect(quality_anomaly).toBeDefined();
    expect(quality_anomaly.quality_score).toBe(30);
    expect(quality_anomaly.quality_threshold).toBe(50);

    const accuracy_anomaly = handoff.aggregated_anomalies.find(
      (a: any) => a.domain === 'INFERENCE_ACCURACY',
    );
    expect(accuracy_anomaly).toBeDefined();
    expect(accuracy_anomaly.accuracy_drop_percentage).toBe(15);

    // Step 9: Verify audit log contains escalation initiation event
    expect(auditLogEvents.length).toBeGreaterThan(0);
    const escalation_event = auditLogEvents.find(
      (e) => e.event_type === 'ESCALATION_INITIATED_BEFORE_SIDE_EFFECT',
    );
    expect(escalation_event).toBeDefined();
    expect(escalation_event?.escalation_reason).toBe(
      'MULTIPLE_DOMAINS_SIMULTANEOUS_ANOMALY',
    );
    expect(typeof escalation_event?.timestamp).toBe('string');
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(escalation_event!.timestamp)).toBe(
      true,
    );

    // Step 10: Verify no auto-remediation actions were executed
    expect(autoRemediationActions.length).toBe(0);

    // Step 11: Verify return value structure
    expect(result.escalation_required).toBe(true);
    expect(result.handoff_required).toBe(true);
    expect(result.human_review_details).toBeDefined();
    expect(typeof result.human_review_details.escalation_status).toBe('string');
    expect(typeof result.human_review_details.severity_level).toBe('string');
  });
});