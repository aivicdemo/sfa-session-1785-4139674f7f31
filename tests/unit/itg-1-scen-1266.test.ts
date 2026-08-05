import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/types';
import type { HealthCheckResult, DataQualityAnalysisResult, InferenceAccuracyEvaluationResult, DiagnosisTrigger, EscalationToHumanEvent, AuditLogEvent } from '../../src/agents/tx-3-imp-1/types';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1266
  test('[error] ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 AIエージェント - 推論精度が目標値から10%以上低下した場合に副作用の確定前に人へ引き継ぐ', async () => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const now = new Date('2024-01-15T10:00:00Z');
    const diagnosticDatetime = now.toISOString();
    const targetAccuracyRate = 100;
    const currentAccuracyRate = 85;
    const accuracyDeclineRate = 15;

    const mockHealthCheckResult: HealthCheckResult = {
      status: 'healthy',
      systemUptime: 99.9,
      lastCheckTime: diagnosticDatetime,
      issues: [],
    };

    const mockDataQualityResult: DataQualityAnalysisResult = {
      qualityScore: 96,
      issueCount: 0,
      analysisTime: diagnosticDatetime,
      problems: [],
    };

    const mockInferenceAccuracyResult: InferenceAccuracyEvaluationResult = {
      currentAccuracy: currentAccuracyRate,
      targetAccuracy: targetAccuracyRate,
      accuracyDecline: accuracyDeclineRate,
      evaluationTime: diagnosticDatetime,
      status: 'degraded',
    };

    const escalationEvents: EscalationToHumanEvent[] = [];
    const auditLogs: AuditLogEvent[] = [];

    const mockAiClient: Tx3Imp1AiClient = {
      executeHealthCheck: jest.fn().mockResolvedValue(mockHealthCheckResult),
      analyzeDataQuality: jest.fn().mockResolvedValue(mockDataQualityResult),
      evaluateInferenceAccuracy: jest.fn().mockResolvedValue(mockInferenceAccuracyResult),
      integrateAndAnalyzeDiagnosis: jest.fn().mockImplementation(async (results) => {
        const escalation: EscalationToHumanEvent = {
          eventId: 'esc-tx3-001',
          timestamp: diagnosticDatetime,
          triggerType: 'accuracy_decline',
          severity: 'critical',
          diagnosticResults: {
            healthCheck: results.healthCheck,
            dataQuality: results.dataQuality,
            inferenceAccuracy: results.inferenceAccuracy,
          },
          currentAccuracyPercentage: currentAccuracyRate,
          targetAccuracyPercentage: targetAccuracyRate,
          accuracyDeclinePercentage: accuracyDeclineRate,
          reason: 'Inference accuracy declined by 15% from target value of 100%',
          requiresHumanJudgment: true,
          autoRemediationBlocked: true,
          auditTrail: {
            detectionTime: diagnosticDatetime,
            escalationInitiatedTime: diagnosticDatetime,
            escalationReason: 'Critical accuracy decline exceeds 10% threshold',
          },
        };
        escalationEvents.push(escalation);

        const auditLog: AuditLogEvent = {
          logId: 'audit-tx3-001',
          timestamp: diagnosticDatetime,
          action: 'escalation_to_human',
          details: {
            reason: 'Inference accuracy degradation detected',
            accuracyDecline: accuracyDeclineRate,
            threshold: 10,
            currentValue: currentAccuracyRate,
            targetValue: targetAccuracyRate,
          },
          status: 'initiated',
        };
        auditLogs.push(auditLog);

        return {
          escalation,
          auditLog,
          autoRemediationBlocked: true,
          pendingHumanDecision: true,
        };
      }),
    };

    const trigger: DiagnosisTrigger = {
      type: 'periodic_monitoring',
      scheduleCycle: 'weekly',
      initiatedAt: diagnosticDatetime,
    };

    const result = await runTx3Imp1Agent(mockAiClient, trigger);

    expect(result).toBeDefined();
    expect(result.escalationTriggered).toBe(true);
    expect(result.escalationReason).toBe('accuracy_decline');
    expect(result.autoRemediationBlocked).toBe(true);
    expect(result.requiresHumanDecision).toBe(true);

    expect(escalationEvents).toHaveLength(1);
    const escalationEvent = escalationEvents[0];
    expect(escalationEvent.severity).toBe('critical');
    expect(escalationEvent.currentAccuracyPercentage).toBe(85);
    expect(escalationEvent.targetAccuracyPercentage).toBe(100);
    expect(escalationEvent.accuracyDeclinePercentage).toBe(15);
    expect(escalationEvent.requiresHumanJudgment).toBe(true);
    expect(escalationEvent.autoRemediationBlocked).toBe(true);

    expect(escalationEvent.diagnosticResults).toBeDefined();
    expect(escalationEvent.diagnosticResults.healthCheck.status).toBe('healthy');
    expect(escalationEvent.diagnosticResults.dataQuality.qualityScore).toBe(96);
    expect(escalationEvent.diagnosticResults.inferenceAccuracy.currentAccuracy).toBe(85);

    expect(escalationEvent.auditTrail).toBeDefined();
    expect(escalationEvent.auditTrail.detectionTime).toBe(diagnosticDatetime);
    expect(escalationEvent.auditTrail.escalationReason).toMatch(/accurate/i);

    expect(auditLogs).toHaveLength(1);
    const auditLog = auditLogs[0];
    expect(auditLog.action).toBe('escalation_to_human');
    expect(auditLog.details.accuracyDecline).toBe(15);
    expect(auditLog.details.threshold).toBe(10);
    expect(auditLog.details.currentValue).toBe(85);
    expect(auditLog.details.targetValue).toBe(100);
    expect(auditLog.status).toBe('initiated');

    expect(result.autoRemediationExecuted).toBe(false);
    expect(result.autoRemediationExecuted).not.toBe(true);
    expect(result.pendingHumanDecision).toBe(true);

    expect(mockAiClient.executeHealthCheck).toHaveBeenCalled();
    expect(mockAiClient.analyzeDataQuality).toHaveBeenCalled();
    expect(mockAiClient.evaluateInferenceAccuracy).toHaveBeenCalled();
    expect(mockAiClient.integrateAndAnalyzeDiagnosis).toHaveBeenCalled();

    fetchMock.disableMocks();
  });
});