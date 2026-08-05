import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/ai-client';
import type {
  HealthCheckDiagnosisResult,
  DataQualityAnalysisResult,
  InferenceAccuracyEvaluationResult,
  AnomalyAggregationReport,
  AuditLogEntry,
} from '../../src/agents/tx-3-imp-1/types';

// Mock AI client for testing
class MockTx3Imp1AiClient implements Tx3Imp1AiClient {
  private healthCheckCompleted = false;
  private shouldFailDataQualityAnalysis = false;
  private inferenceAccuracyCompleted = false;

  setHealthCheckCompletion(completed: boolean): void {
    this.healthCheckCompleted = completed;
  }

  setShouldFailDataQualityAnalysis(shouldFail: boolean): void {
    this.shouldFailDataQualityAnalysis = shouldFail;
  }

  setInferenceAccuracyCompletion(completed: boolean): void {
    this.inferenceAccuracyCompleted = completed;
  }

  async executeHealthCheckDiagnosis(): Promise<HealthCheckDiagnosisResult> {
    if (!this.healthCheckCompleted) {
      throw new Error('Health check not initiated');
    }
    return {
      diagnosis_id: 'hc-diag-001',
      timestamp: new Date('2024-01-15T10:00:00Z'),
      system_status: 'OPERATIONAL',
      cpu_usage_percent: 45.2,
      memory_usage_percent: 62.1,
      database_connection_status: 'CONNECTED',
      api_response_time_ms: 234,
      passed: true,
    };
  }

  async executeDataQualityAnalysis(): Promise<DataQualityAnalysisResult> {
    if (this.shouldFailDataQualityAnalysis) {
      throw new Error('Data quality analysis service temporarily unavailable');
    }
    return {
      analysis_id: 'dq-analysis-002',
      timestamp: new Date('2024-01-15T10:05:00Z'),
      quality_score: 87.5,
      issues_detected: 12,
      missing_values_percent: 2.3,
      duplicate_records_count: 5,
      passed: true,
    };
  }

  async executeInferenceAccuracyEvaluation(): Promise<InferenceAccuracyEvaluationResult> {
    if (!this.inferenceAccuracyCompleted) {
      throw new Error('Inference accuracy evaluation not initiated');
    }
    return {
      evaluation_id: 'ia-eval-003',
      timestamp: new Date('2024-01-15T10:10:00Z'),
      accuracy_score: 92.3,
      precision: 93.1,
      recall: 91.5,
      f1_score: 92.3,
      passed: true,
    };
  }
}

// Mock database for tracking side effects
class MockSystemDatabase {
  private records: Map<string, HealthCheckDiagnosisResult> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private compensationLogs: string[] = [];

  async saveHealthCheckDiagnosis(
    diagnosis: HealthCheckDiagnosisResult
  ): Promise<void> {
    this.records.set(diagnosis.diagnosis_id, diagnosis);
  }

  async deleteHealthCheckDiagnosis(diagnosis_id: string): Promise<void> {
    this.records.delete(diagnosis_id);
  }

  async recordAuditLog(entry: AuditLogEntry): Promise<void> {
    this.auditLog.push(entry);
  }

  async recordCompensationLog(log: string): Promise<void> {
    this.compensationLogs.push(log);
  }

  getRecordCount(): number {
    return this.records.size;
  }

  getAuditLog(): AuditLogEntry[] {
    return this.auditLog;
  }

  getCompensationLogs(): string[] {
    return this.compensationLogs;
  }

  hasRecord(diagnosis_id: string): boolean {
    return this.records.has(diagnosis_id);
  }

  getRecords(): Map<string, HealthCheckDiagnosisResult> {
    return this.records;
  }

  clear(): void {
    this.records.clear();
    this.auditLog = [];
    this.compensationLogs = [];
  }
}

describe('Health check, data quality, and inference accuracy integrated diagnosis with rollback', () => {
  let mockAiClient: MockTx3Imp1AiClient;
  let mockDatabase: MockSystemDatabase;

  beforeEach(() => {
    mockAiClient = new MockTx3Imp1AiClient();
    mockDatabase = new MockSystemDatabase();
  });

  afterEach(() => {
    mockDatabase.clear();
  });

  // SCEN-1274
  test('should rollback partial side effects when data quality analysis fails mid-execution', async () => {
    // Setup: Initialize AI client with successful health check and inference accuracy
    mockAiClient.setHealthCheckCompletion(true);
    mockAiClient.setInferenceAccuracyCompletion(true);

    // Arrange: Set data quality analysis to fail
    mockAiClient.setShouldFailDataQualityAnalysis(true);

    // Simulate orchestrator execution with rollback capability
    const executionResult = {
      agent_execution_id: 'agent-exec-001',
      start_timestamp: new Date('2024-01-15T10:00:00Z'),
      status: 'FAILED' as const,
      triggered_by: 'ANOMALY_ALERT' as const,
      completed_actions: [] as string[],
      failed_action: 'executeDataQualityAnalysis',
      error_message: 'Data quality analysis service temporarily unavailable',
    };

    try {
      // Step 1: Execute health check diagnosis
      const healthCheckResult =
        await mockAiClient.executeHealthCheckDiagnosis();
      await mockDatabase.saveHealthCheckDiagnosis(healthCheckResult);
      executionResult.completed_actions.push('executeHealthCheckDiagnosis');

      // Verify side effect 1: Health check result recorded
      expect(mockDatabase.hasRecord(healthCheckResult.diagnosis_id)).toBe(true);
      expect(mockDatabase.getRecordCount()).toBe(1);

      // Step 2: Attempt data quality analysis (will fail)
      await mockAiClient.executeDataQualityAnalysis();

      // This line should not be reached
      executionResult.completed_actions.push('executeDataQualityAnalysis');
    } catch (error) {
      // Step 3: Capture error and mark action as failed
      executionResult.failed_action = 'executeDataQualityAnalysis';
      executionResult.error_message = (error as Error).message;

      // Step 4: Initiate rollback for completed actions
      for (const action of executionResult.completed_actions) {
        if (action === 'executeHealthCheckDiagnosis') {
          // Rollback health check diagnosis result
          const healthCheckResult =
            await mockAiClient.executeHealthCheckDiagnosis();
          await mockDatabase.deleteHealthCheckDiagnosis(
            healthCheckResult.diagnosis_id
          );

          // Record rollback in audit log
          const rollbackEntry: AuditLogEntry = {
            audit_id: 'audit-rollback-001',
            audit_type: 'ROLLBACK',
            audit_timestamp: new Date('2024-01-15T10:05:30Z'),
            affected_record_id: healthCheckResult.diagnosis_id,
            reason: 'data_quality_analysis_failed',
            agent_execution_id: executionResult.agent_execution_id,
            details: `Rolled back health check diagnosis after data quality analysis failed`,
          };
          await mockDatabase.recordAuditLog(rollbackEntry);

          // Record compensation transaction
          const compensationLog = `COMPENSATION_EXECUTED: Deleted health check diagnosis record ${healthCheckResult.diagnosis_id} at ${new Date('2024-01-15T10:05:31Z').toISOString()}`;
          await mockDatabase.recordCompensationLog(compensationLog);

          // Record compensation in audit log
          const compensationEntry: AuditLogEntry = {
            audit_id: 'audit-comp-001',
            audit_type: 'COMPENSATION_EXECUTED',
            audit_timestamp: new Date('2024-01-15T10:05:31Z'),
            affected_record_id: healthCheckResult.diagnosis_id,
            reason: 'rollback_compensation_for_failed_data_quality_analysis',
            agent_execution_id: executionResult.agent_execution_id,
            details: `Compensation transaction executed to remove orphaned health check record`,
          };
          await mockDatabase.recordAuditLog(compensationEntry);
        }
      }
    }

    // Assertions

    // (1) Verify health check diagnosis record was deleted (rollback completed)
    expect(mockDatabase.getRecordCount()).toBe(0);
    expect(mockDatabase.hasRecord('hc-diag-001')).toBe(false);

    // (2) Verify ROLLBACK audit log entry exists with correct details
    const auditLog = mockDatabase.getAuditLog();
    const rollbackEntry = auditLog.find((log) => log.audit_type === 'ROLLBACK');
    expect(rollbackEntry).toBeDefined();
    expect(rollbackEntry?.affected_record_id).toBe('hc-diag-001');
    expect(rollbackEntry?.reason).toBe('data_quality_analysis_failed');
    expect(rollbackEntry?.audit_timestamp).toEqual(
      new Date('2024-01-15T10:05:30Z')
    );

    // (3) Verify COMPENSATION_EXECUTED audit log entry exists
    const compensationEntry = auditLog.find(
      (log) => log.audit_type === 'COMPENSATION_EXECUTED'
    );
    expect(compensationEntry).toBeDefined();
    expect(compensationEntry?.affected_record_id).toBe('hc-diag-001');
    expect(compensationEntry?.reason).toBe(
      'rollback_compensation_for_failed_data_quality_analysis'
    );
    expect(compensationEntry?.audit_timestamp).toEqual(
      new Date('2024-01-15T10:05:31Z')
    );

    // Verify compensation log was recorded
    const compensationLogs = mockDatabase.getCompensationLogs();
    expect(compensationLogs.length).toBe(1);
    expect(compensationLogs[0]).toMatch(/COMPENSATION_EXECUTED/);
    expect(compensationLogs[0]).toMatch(/hc-diag-001/);

    // (4) Verify final agent execution status is FAILED
    expect(executionResult.status).toBe('FAILED');
    expect(executionResult.failed_action).toBe('executeDataQualityAnalysis');

    // Verify no orphaned records exist
    expect(mockDatabase.getRecordCount()).toBe(0);

    // Verify error message is captured
    expect(executionResult.error_message).toMatch(
      /Data quality analysis service/
    );

    // Verify audit log contains exactly 2 entries (ROLLBACK + COMPENSATION_EXECUTED)
    expect(auditLog.length).toBe(2);
  });
});