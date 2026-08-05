import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/ai-client';

// Mock audit logger
const mockAuditLog = jest.fn();
const mockAutoRecoveryAction = jest.fn();
const mockAutoAlertNotification = jest.fn();
const mockRollbackAction = jest.fn();

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1265
  test('ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 - データ品質スコア低下時の人への引き継ぎ', async () => {
    // Reset mocks
    mockAuditLog.mockClear();
    mockAutoRecoveryAction.mockClear();
    mockAutoAlertNotification.mockClear();
    mockRollbackAction.mockClear();

    // Define thresholds and test data
    const DATA_QUALITY_THRESHOLD = 95;
    const DETECTED_QUALITY_SCORE = 57; // 60% of threshold (57 = 95 * 0.6)
    const HEALTH_CHECK_STATUS = 'healthy';
    const INFERENCE_ACCURACY = 92;

    // Create stub AI client with predefined responses
    const stubAiClient: Partial<Tx3Imp1AiClient> = {
      executeHealthCheck: jest.fn().mockResolvedValue({
        systemStatus: HEALTH_CHECK_STATUS,
        timestamp: '2024-01-15T11:00:00Z',
        details: { cpu: 45, memory: 60, diskUsage: 70 }
      }),
      executeDataQualityAnalysis: jest.fn().mockResolvedValue({
        qualityScore: DETECTED_QUALITY_SCORE,
        threshold: DATA_QUALITY_THRESHOLD,
        issues: [
          { category: 'missing_values', count: 120, affectedRecords: 45 },
          { category: 'format_error', count: 35, affectedRecords: 15 }
        ],
        timestamp: '2024-01-15T11:00:00Z'
      }),
      executeInferenceAccuracyEvaluation: jest.fn().mockResolvedValue({
        accuracyScore: INFERENCE_ACCURACY,
        evaluationPeriod: '2024-01-01T00:00:00Z to 2024-01-15T11:00:00Z',
        sampleSize: 500,
        details: { precision: 0.91, recall: 0.93 }
      }),
      createEscalationReport: jest.fn().mockResolvedValue({
        escalationId: 'ESC-TX3-20240115-001',
        reason: `データ品質スコアが閾値の60%に低下。現在値: ${DETECTED_QUALITY_SCORE}%, 閾値: ${DATA_QUALITY_THRESHOLD}%`,
        currentScore: DETECTED_QUALITY_SCORE,
        thresholdValue: DATA_QUALITY_THRESHOLD,
        requiresInvestigation: true,
        awaitingHumanApproval: true,
        message: `根本原因の特定に追加調査が必要です。人の確認と承認待機状態に遷移します。`
      })
    };

    // Inject dependencies
    const orchestratorContext = {
      aiClient: stubAiClient as Tx3Imp1AiClient,
      auditLogger: mockAuditLog,
      autoRecoveryExecutor: mockAutoRecoveryAction,
      autoAlertNotifier: mockAutoAlertNotification,
      rollbackExecutor: mockRollbackAction,
      triggerSource: 'alert_received' as const,
      alertType: 'data_quality_anomaly' as const
    };

    // Execute agent orchestrator
    const result = await runTx3Imp1Agent(orchestratorContext);

    // Verify health check was executed
    expect(stubAiClient.executeHealthCheck).toHaveBeenCalledTimes(1);

    // Verify data quality analysis was executed
    expect(stubAiClient.executeDataQualityAnalysis).toHaveBeenCalledTimes(1);

    // Verify inference accuracy evaluation was executed
    expect(stubAiClient.executeInferenceAccuracyEvaluation).toHaveBeenCalledTimes(1);

    // Verify escalation report was created
    expect(stubAiClient.createEscalationReport).toHaveBeenCalledTimes(1);

    // Verify escalation condition was triggered
    expect(result.escalationTriggered).toBe(true);
    expect(result.escalationReason).toBe('data_quality_threshold_exceeded');

    // Verify escalation report contains correct information
    expect(result.escalationReport).toBeDefined();
    expect(result.escalationReport.currentScore).toBe(DETECTED_QUALITY_SCORE);
    expect(result.escalationReport.thresholdValue).toBe(DATA_QUALITY_THRESHOLD);
    expect(result.escalationReport.requiresInvestigation).toBe(true);
    expect(result.escalationReport.awaitingHumanApproval).toBe(true);
    expect(result.escalationReport.message).toContain('根本原因の特定に追加調査が必要です');
    expect(result.escalationReport.message).toContain('人の確認と承認待機状態');

    // Verify human handoff message is generated
    expect(result.handoffMessage).toBeDefined();
    expect(result.handoffMessage).toContain('閾値の60%に低下');
    expect(result.handoffMessage).toContain(`現在値: ${DETECTED_QUALITY_SCORE}%`);
    expect(result.handoffMessage).toContain(`閾値: ${DATA_QUALITY_THRESHOLD}%`);
    expect(result.handoffMessage).toContain('根本原因の特定に追加調査が必要');
    expect(result.handoffMessage).toContain('人の確認と承認待機状態');

    // Verify auto-remediation action was NOT called
    expect(mockAutoRecoveryAction).toHaveBeenCalledTimes(0);

    // Verify auto-alert notification was NOT called
    expect(mockAutoAlertNotification).toHaveBeenCalledTimes(0);

    // Verify audit log recorded the entire sequence
    expect(mockAuditLog).toHaveBeenCalledTimes(4);
    
    const auditCalls = mockAuditLog.mock.calls;
    expect(auditCalls[0][0]).toEqual({
      eventType: 'health_check_completed',
      timestamp: expect.any(String),
      status: HEALTH_CHECK_STATUS
    });
    expect(auditCalls[1][0]).toEqual({
      eventType: 'data_quality_analysis_completed',
      timestamp: expect.any(String),
      qualityScore: DETECTED_QUALITY_SCORE,
      threshold: DATA_QUALITY_THRESHOLD
    });
    expect(auditCalls[2][0]).toEqual({
      eventType: 'inference_accuracy_evaluation_completed',
      timestamp: expect.any(String),
      accuracyScore: INFERENCE_ACCURACY
    });
    expect(auditCalls[3][0]).toEqual({
      eventType: 'escalation_detected_and_handoff_initiated',
      timestamp: expect.any(String),
      escalationId: 'ESC-TX3-20240115-001',
      reason: 'data_quality_threshold_exceeded',
      awaitingHumanApproval: true
    });

    // Verify system is in handoff state, not in final resolved state
    expect(result.systemState).toBe('awaiting_human_approval');

    // Verify rollback capability information is available
    expect(result.rollbackInfo).toBeDefined();
    expect(result.rollbackInfo.canRollback).toBe(true);
    expect(result.rollbackInfo.partialEffectsExecuted).toBe(false);

    // Verify side-effect confirmation logic was not called
    expect(mockRollbackAction).toHaveBeenCalledTimes(0);
  });
});