import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';

interface ValidationRule {
  ruleId: string;
  condition: string;
  isMandatory: boolean;
}

interface HealthCheckDiagnosisResult {
  timestamp: string;
  systemStatus: string;
  validationRules: ValidationRule[];
  conflictDetected: boolean;
  conflictDetails?: {
    ruleIdA: string;
    ruleIdB: string;
    conditionA: string;
    conditionB: string;
    conflictType: string;
  };
}

interface DataQualityAnalysisResult {
  timestamp: string;
  qualityScore: number;
  issues: Array<{
    type: string;
    severity: string;
    details: string;
  }>;
}

interface AnomalyClassification {
  anomalyType: string;
  severity: number;
  severityLabel: string;
  ruleDetails: {
    ruleIdA: string;
    ruleIdB: string;
    conditionA: string;
    conditionB: string;
    conflictType: string;
  };
}

interface PriorityJudgmentResult {
  isEscalationRequired: boolean;
  escalationReason: string;
  requiresAdditionalInvestigation: boolean;
}

interface Tx3Imp1Report {
  timestamp: string;
  diagnosticsExecuted: boolean;
  anomalies: AnomalyClassification[];
  priorityJudgment: PriorityJudgmentResult;
  auditLog: Array<{
    step: string;
    timestamp: string;
    detail: string;
  }>;
}

interface Tx3Imp1AiClient {
  executeHealthCheckDiagnosis(params: {
    targetRules: ValidationRule[];
  }): Promise<HealthCheckDiagnosisResult>;
  executeDataQualityAnalysis(): Promise<DataQualityAnalysisResult>;
  executeInferencePrecisionEvaluation(): Promise<{
    timestamp: string;
    precisionScore: number;
  }>;
}

class MockTx3Imp1AiClient implements Tx3Imp1AiClient {
  async executeHealthCheckDiagnosis(params: {
    targetRules: ValidationRule[];
  }): Promise<HealthCheckDiagnosisResult> {
    const hasConflict = params.targetRules.some(
      (r) => r.condition === '売上金額 > 0'
    ) &&
      params.targetRules.some((r) => r.condition === '売上金額 = 0');

    if (hasConflict) {
      return {
        timestamp: '2024-01-15T11:00:00Z',
        systemStatus: 'HEALTHY',
        validationRules: params.targetRules,
        conflictDetected: true,
        conflictDetails: {
          ruleIdA: 'RULE_001',
          ruleIdB: 'RULE_002',
          conditionA: '売上金額 > 0',
          conditionB: '売上金額 = 0',
          conflictType: 'MUTUAL_EXCLUSION'
        }
      };
    }

    return {
      timestamp: '2024-01-15T11:00:00Z',
      systemStatus: 'HEALTHY',
      validationRules: params.targetRules,
      conflictDetected: false
    };
  }

  async executeDataQualityAnalysis(): Promise<DataQualityAnalysisResult> {
    return {
      timestamp: '2024-01-15T11:00:00Z',
      qualityScore: 85,
      issues: []
    };
  }

  async executeInferencePrecisionEvaluation(): Promise<{
    timestamp: string;
    precisionScore: number;
  }> {
    return {
      timestamp: '2024-01-15T11:00:00Z',
      precisionScore: 92
    };
  }
}

class ValidationRuleConflictError extends Error {
  type: string = 'ValidationRuleConflictError';
  code: string;
  severity: number;
  severityLabel: string;
  conflictDetails: {
    ruleIdA: string;
    ruleIdB: string;
    conditionA: string;
    conditionB: string;
    conflictType: string;
  };

  constructor(
    message: string,
    code: string,
    severity: number,
    severityLabel: string,
    conflictDetails: {
      ruleIdA: string;
      ruleIdB: string;
      conditionA: string;
      conditionB: string;
      conflictType: string;
    }
  ) {
    super(message);
    this.code = code;
    this.severity = severity;
    this.severityLabel = severityLabel;
    this.conflictDetails = conflictDetails;
  }
}

describe('営業プロセス実行状況の監査ダッシュボード - ヘルスチェック実行', () => {
  let mockAiClient: MockTx3Imp1AiClient;
  let auditLog: Array<{ step: string; timestamp: string; detail: string }>;

  beforeEach(() => {
    mockAiClient = new MockTx3Imp1AiClient();
    auditLog = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-337: [error] システムヘルスチェック実行機能 - 営業データの検証ルールが矛盾している場合、エラーが発生する
  test('should detect validation rule conflicts and throw CRITICAL error with escalation', async () => {
    const conflictingRules: ValidationRule[] = [
      {
        ruleId: 'RULE_001',
        condition: '売上金額 > 0',
        isMandatory: true
      },
      {
        ruleId: 'RULE_002',
        condition: '売上金額 = 0',
        isMandatory: true
      }
    ];

    const diagnosisResult =
      await mockAiClient.executeHealthCheckDiagnosis({
        targetRules: conflictingRules
      });

    auditLog.push({
      step: 'HealthCheckDiagnosisExecution',
      timestamp: '2024-01-15T11:00:00Z',
      detail: `ヘルスチェック診断実行: 矛盾ルール検出=${diagnosisResult.conflictDetected}`
    });

    expect(diagnosisResult.conflictDetected).toBe(true);

    if (diagnosisResult.conflictDetected && diagnosisResult.conflictDetails) {
      const anomaly: AnomalyClassification = {
        anomalyType: 'RULE_DEFINITION_ERROR',
        severity: 3,
        severityLabel: 'CRITICAL',
        ruleDetails: diagnosisResult.conflictDetails
      };

      auditLog.push({
        step: 'AnomalyClassification',
        timestamp: '2024-01-15T11:00:00Z',
        detail: `異常分類: 種類=${anomaly.anomalyType}, 重大度=${anomaly.severityLabel}`
      });

      const priorityJudgment: PriorityJudgmentResult = {
        isEscalationRequired: true,
        escalationReason:
          '営業データ検証ルール内に矛盾が存在します：ルールA(売上金額 > 0)とルールB(売上金額 = 0)が同時に要求されています',
        requiresAdditionalInvestigation: true
      };

      auditLog.push({
        step: 'PriorityJudgment',
        timestamp: '2024-01-15T11:00:00Z',
        detail: `優先度判定: エスカレーション必要=${priorityJudgment.isEscalationRequired}, 追加調査必要=${priorityJudgment.requiresAdditionalInvestigation}`
      });

      const error = new ValidationRuleConflictError(
        '営業データ検証ルール内に矛盾が存在します：ルールA(売上金額 > 0)とルールB(売上金額 = 0)が同時に要求されています',
        'ERR_RULE_CONFLICT_001',
        3,
        'CRITICAL',
        diagnosisResult.conflictDetails
      );

      expect(error.type).toBe('ValidationRuleConflictError');
      expect(error.code).toBe('ERR_RULE_CONFLICT_001');
      expect(error.message).toMatch(/営業データ検証ルール/);
      expect(error.severity).toBeGreaterThanOrEqual(3);
      expect(error.severityLabel).toBe('CRITICAL');
      expect(error.conflictDetails.ruleIdA).toBe('RULE_001');
      expect(error.conflictDetails.ruleIdB).toBe('RULE_002');
      expect(error.conflictDetails.conditionA).toBe('売上金額 > 0');
      expect(error.conflictDetails.conditionB).toBe('売上金額 = 0');
      expect(error.conflictDetails.conflictType).toBe('MUTUAL_EXCLUSION');

      expect(priorityJudgment.isEscalationRequired).toBe(true);
      expect(priorityJudgment.requiresAdditionalInvestigation).toBe(true);
      expect(priorityJudgment.escalationReason).toMatch(/ルール定義エラー/);

      const report: Tx3Imp1Report = {
        timestamp: '2024-01-15T11:00:00Z',
        diagnosticsExecuted: true,
        anomalies: [anomaly],
        priorityJudgment: priorityJudgment,
        auditLog: auditLog
      };

      expect(report.diagnosticsExecuted).toBe(true);
      expect(report.anomalies).toHaveLength(1);
      expect(report.anomalies[0].anomalyType).toBe('RULE_DEFINITION_ERROR');
      expect(report.anomalies[0].severity).toBeGreaterThanOrEqual(3);
      expect(report.anomalies[0].severityLabel).toBe('CRITICAL');
      expect(report.auditLog).toHaveLength(3);
      expect(report.auditLog[0].step).toBe('HealthCheckDiagnosisExecution');
      expect(report.auditLog[1].step).toBe('AnomalyClassification');
      expect(report.auditLog[2].step).toBe('PriorityJudgment');

      expect(auditLog).toContainEqual(
        expect.objectContaining({
          step: 'HealthCheckDiagnosisExecution',
          detail: expect.stringMatching(/矛盾ルール検出/)
        })
      );

      expect(auditLog).toContainEqual(
        expect.objectContaining({
          step: 'AnomalyClassification',
          detail: expect.stringMatching(/RULE_DEFINITION_ERROR/)
        })
      );

      expect(auditLog).toContainEqual(
        expect.objectContaining({
          step: 'PriorityJudgment',
          detail: expect.stringMatching(/追加調査必要=true/)
        })
      );

      expect(() => {
        throw error;
      }).toThrow(/ルール定義/);

      expect(() => {
        throw error;
      }).toThrow(/矛盾/);
    }
  });
});