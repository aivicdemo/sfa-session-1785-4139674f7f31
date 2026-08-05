import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/agents/tx-3-imp-1/orchestrator';
import type { Tx3Imp1AiClient } from '../../src/agents/tx-3-imp-1/ai-client';
import { getLastAuditEvent } from '../../src/logic/it-1';

// Mock AI client that simulates database connection failure
class MockTx3Imp1AiClientWithDbError implements Tx3Imp1AiClient {
  async executeHealthCheck(): Promise<any> {
    throw new Error('Database connection timeout');
  }

  async executeDataQualityAnalysis(): Promise<any> {
    throw new Error('営業データ品質検証データベース接続失敗');
  }

  async executePrecisionEvaluation(): Promise<any> {
    return { precision_score: 92 };
  }

  async aggregateAnomalies(): Promise<any> {
    return { anomalies: [] };
  }

  async determinePriority(): Promise<any> {
    return { priority: 'high' };
  }

  async generateReport(): Promise<any> {
    return { report_id: 'report-001' };
  }
}

describe('営業プロセス実行状況の監査ダッシュボード - システムヘルスチェック実行機能', () => {
  let aiClient: MockTx3Imp1AiClientWithDbError;
  let auditLogBefore: any;

  beforeEach(() => {
    aiClient = new MockTx3Imp1AiClientWithDbError();
    auditLogBefore = getLastAuditEvent();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-334
  test('should throw error with DB_CONNECTION_ERROR code when sales data quality database connection fails during health check execution', async () => {
    const triggerConfig = {
      trigger_type: 'weekly_schedule',
      scheduled_time: '2024-01-15T09:00:00Z',
      monitoring_scope: 'system_health_data_quality_precision',
    };

    let capturedError: any = null;

    try {
      await runTx3Imp1Agent(aiClient, triggerConfig);
    } catch (error) {
      capturedError = error;
    }

    // (1) Verify that runTx3Imp1Agent() throws an Error exception
    expect(capturedError).toBeInstanceOf(Error);

    // (2) Verify error message contains database connection failure indicator
    expect(capturedError.message).toMatch(/営業データ品質検証データベース接続失敗/);

    // (3) Verify error object code attribute is 'DB_CONNECTION_ERROR'
    expect(capturedError.code).toBe('DB_CONNECTION_ERROR');

    // (4) Verify audit log contains at least one record with type 'ERROR', operation 'data_quality_db_connect', resource 'sales_data_quality_db', status 'FAILED'
    const auditEvent = getLastAuditEvent();
    expect(auditEvent).toBeDefined();
    expect(auditEvent.event_type).toBe('ERROR');
    expect(auditEvent.operation).toBe('data_quality_db_connect');
    expect(auditEvent.resource).toBe('sales_data_quality_db');
    expect(auditEvent.status).toBe('FAILED');

    // (5) Verify stack trace contains database driver connection failure information
    expect(capturedError.stack).toBeDefined();
    expect(capturedError.stack).toMatch(/connection|timeout|database|Database/i);

    // (6) Verify escalation condition is met - high priority is set in report due to additional investigation needed
    expect(capturedError.escalation_condition).toBe('additional_investigation_required');
    expect(capturedError.response_priority).toBe('high');
  });
});