import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx1Imp1Agent } from '../../src/agents/tx-1-imp-1/orchestrator';
import type { Tx1Imp1AiClient } from '../../src/agents/tx-1-imp-1/ai-client';

interface MockAiClientState {
  extractionData: unknown[];
  validationResult: { isValid: boolean; score: number; issues: string[] };
  deduplicationResult: { hasDuplicates: boolean; candidates: unknown[] };
  normalizedData: unknown[];
  postValidationResult: { isValid: boolean; score: number };
  registrationError: Error | null;
  processLog: Array<{ timestamp: string; action: string; status: string; details?: unknown }>;
}

interface HumanReviewRecord {
  escalation_id: string;
  escalation_type: string;
  error_details: string;
  autonomous_actions_completed: string[];
  normalized_data_checkpoint: unknown[];
  timestamp: string;
  status: string;
}

interface AnalysisSystemDb {
  registeredData: unknown[];
}

class FakeTx1Imp1AiClient implements Tx1Imp1AiClient {
  private state: MockAiClientState;
  private humanReviewDb: HumanReviewRecord[] = [];
  private analysisSystemDb: AnalysisSystemDb = { registeredData: [] };
  private processLogPath = '/tmp/test_process_log.jsonl';

  constructor() {
    this.state = {
      extractionData: [
        { id: 'log_001', date: '2024-01-15', action: 'call', result: 'success' },
        { id: 'log_002', date: '2024-01-15', action: 'visit', result: 'success' },
      ],
      validationResult: { isValid: true, score: 95, issues: [] },
      deduplicationResult: { hasDuplicates: false, candidates: [] },
      normalizedData: [
        { id: 'log_001_norm', date: '2024-01-15', action: 'call', result: 'success', normalized_at: '2024-01-15T11:00:00Z' },
        { id: 'log_002_norm', date: '2024-01-15', action: 'visit', result: 'success', normalized_at: '2024-01-15T11:00:00Z' },
      ],
      postValidationResult: { isValid: true, score: 98 },
      registrationError: null,
      processLog: [],
    };
  }

  setRegistrationError(error: Error): void {
    this.state.registrationError = error;
  }

  getHumanReviewRecords(): HumanReviewRecord[] {
    return this.humanReviewDb;
  }

  getAnalysisSystemDb(): AnalysisSystemDb {
    return this.analysisSystemDb;
  }

  getProcessLog(): Array<{ timestamp: string; action: string; status: string; details?: unknown }> {
    return this.state.processLog;
  }

  async extractProcessLogs(
    _startDate: string,
    _endDate: string
  ): Promise<{ data: unknown[]; extractedCount: number }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'extraction',
      status: 'completed',
      details: { extractedCount: this.state.extractionData.length },
    });
    return {
      data: this.state.extractionData,
      extractedCount: this.state.extractionData.length,
    };
  }

  async validateCompleteness(_data: unknown[]): Promise<{ isValid: boolean; score: number; issues: string[] }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'validation',
      status: 'completed',
      details: this.state.validationResult,
    });
    return this.state.validationResult;
  }

  async calculateQualityScore(_data: unknown[]): Promise<{ score: number; missingFields: string[] }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'quality_scoring',
      status: 'completed',
      details: { score: 95 },
    });
    return { score: 95, missingFields: [] };
  }

  async detectDuplicates(_data: unknown[]): Promise<{ hasDuplicates: boolean; mergeCandidates: unknown[] }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'deduplication',
      status: 'completed',
      details: this.state.deduplicationResult,
    });
    return {
      hasDuplicates: this.state.deduplicationResult.hasDuplicates,
      mergeCandidates: this.state.deduplicationResult.candidates,
    };
  }

  async applyCleaningRules(_data: unknown[]): Promise<{ normalizedData: unknown[]; rulesApplied: number }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'normalization',
      status: 'completed',
      details: { rulesApplied: 3 },
    });
    return {
      normalizedData: this.state.normalizedData,
      rulesApplied: 3,
    };
  }

  async validateNormalizedData(_data: unknown[]): Promise<{ isValid: boolean; score: number }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    this.state.processLog.push({
      timestamp,
      action: 'post_normalization_validation',
      status: 'completed',
      details: this.state.postValidationResult,
    });
    return this.state.postValidationResult;
  }

  async registerToAnalysisSystem(_data: unknown[]): Promise<{ registrationId: string; recordsRegistered: number }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();

    if (this.state.registrationError) {
      this.state.processLog.push({
        timestamp,
        action: 'registration',
        status: 'failed',
        details: { error: this.state.registrationError.message },
      });
      throw this.state.registrationError;
    }

    this.state.processLog.push({
      timestamp,
      action: 'registration',
      status: 'completed',
      details: { recordsRegistered: this.state.normalizedData.length },
    });
    this.analysisSystemDb.registeredData = [...this.state.normalizedData];
    return {
      registrationId: 'reg_001',
      recordsRegistered: this.state.normalizedData.length,
    };
  }

  async createEscalation(escalationData: {
    escalation_type: string;
    error_details: string;
    autonomous_actions_completed: string[];
    normalized_data_checkpoint: unknown[];
  }): Promise<{ escalation_id: string }> {
    const timestamp = new Date('2024-01-15T11:00:00Z').toISOString();
    const escalation_id = `esc_${Date.now()}`;
    const record: HumanReviewRecord = {
      escalation_id,
      escalation_type: escalationData.escalation_type,
      error_details: escalationData.error_details,
      autonomous_actions_completed: escalationData.autonomous_actions_completed,
      normalized_data_checkpoint: escalationData.normalized_data_checkpoint,
      timestamp,
      status: 'pending_human_review',
    };
    this.humanReviewDb.push(record);

    this.state.processLog.push({
      timestamp,
      action: 'escalation',
      status: 'created',
      details: { escalation_id, escalation_type: escalationData.escalation_type },
    });

    return { escalation_id };
  }

  async recordProcessLog(logEntry: { timestamp: string; action: string; status: string; details?: unknown }): Promise<void> {
    this.state.processLog.push(logEntry);
  }
}

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1233
  test('should escalate to human review when system registration fails before side effect confirmation', async () => {
    const fakeClient = new FakeTx1Imp1AiClient();
    const registrationError = new Error('System registration failed');
    (registrationError as any).statusCode = 500;
    fakeClient.setRegistrationError(registrationError);

    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const salesPersonId = 'sales_001';

    try {
      await runTx1Imp1Agent(
        {
          startDate,
          endDate,
          salesPersonIds: [salesPersonId],
        },
        fakeClient
      );
    } catch (error) {
      expect((error as Error).message).toMatch(/registration/i);
    }

    // Verify analysis system DB remains empty (no side effect confirmed)
    const analysisDb = fakeClient.getAnalysisSystemDb();
    expect(analysisDb.registeredData).toEqual([]);

    // Verify human_review record was created with correct escalation details
    const humanReviewRecords = fakeClient.getHumanReviewRecords();
    expect(humanReviewRecords.length).toBe(1);

    const escalationRecord = humanReviewRecords[0];
    expect(escalationRecord.escalation_type).toBe('system_registration_error');
    expect(escalationRecord.error_details).toBe('System registration failed');
    expect(escalationRecord.status).toBe('pending_human_review');
    expect(escalationRecord.autonomous_actions_completed).toContain('extraction');
    expect(escalationRecord.autonomous_actions_completed).toContain('validation');
    expect(escalationRecord.autonomous_actions_completed).toContain('quality_scoring');
    expect(escalationRecord.autonomous_actions_completed).toContain('deduplication');
    expect(escalationRecord.autonomous_actions_completed).toContain('normalization');
    expect(escalationRecord.autonomous_actions_completed).toContain('post_normalization_validation');
    expect(escalationRecord.autonomous_actions_completed.length).toBe(6);

    // Verify normalized data checkpoint is preserved
    expect(escalationRecord.normalized_data_checkpoint.length).toBeGreaterThan(0);
    expect(escalationRecord.normalized_data_checkpoint[0]).toHaveProperty('id');
    expect(escalationRecord.normalized_data_checkpoint[0]).toHaveProperty('normalized_at');

    // Verify escalation record has timestamp in ISO format
    expect(escalationRecord.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

    // Verify process log contains full sequence including escalation
    const processLog = fakeClient.getProcessLog();
    expect(processLog.length).toBeGreaterThanOrEqual(8);

    const logActions = processLog.map(entry => entry.action);
    expect(logActions).toContain('extraction');
    expect(logActions).toContain('validation');
    expect(logActions).toContain('quality_scoring');
    expect(logActions).toContain('deduplication');
    expect(logActions).toContain('normalization');
    expect(logActions).toContain('post_normalization_validation');
    expect(logActions).toContain('registration');
    expect(logActions).toContain('escalation');

    // Verify registration log entry shows failure status
    const registrationLogEntry = processLog.find(entry => entry.action === 'registration');
    expect(registrationLogEntry).toBeDefined();
    expect(registrationLogEntry?.status).toBe('failed');
    expect(registrationLogEntry?.details).toHaveProperty('error');

    // Verify escalation log entry references the registration error
    const escalationLogEntry = processLog.find(entry => entry.action === 'escalation');
    expect(escalationLogEntry).toBeDefined();
    expect(escalationLogEntry?.status).toBe('created');
    expect(escalationLogEntry?.details).toHaveProperty('escalation_id');

    // Verify all timestamps are in ISO format and sequential
    processLog.forEach(entry => {
      expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    });

    // Verify human can retrieve escalation details for review
    expect(escalationRecord.escalation_id).toMatch(/^esc_\d+$/);
    expect(escalationRecord.autonomous_actions_completed).toEqual([
      'extraction',
      'validation',
      'quality_scoring',
      'deduplication',
      'normalization',
      'post_normalization_validation',
    ]);

    // Verify human has actionable options (escalation record exists and is retrievable)
    expect(humanReviewRecords).toHaveLength(1);
    expect(humanReviewRecords[0].status).toBe('pending_human_review');
  });
});