import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx3Imp1Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-332
  it('should throw AuthorizationError when user lacks permission to run system health check', async () => {
    const userContext = {
      userId: 'user-insufficient-perms-001',
      userName: 'Operator A',
      role: 'sales_representative',
      permissions: ['view_dashboard'],
      departmentId: 'dept-001',
      companyId: 'company-001'
    };

    const healthCheckRequest = {
      checkType: 'INTEGRATED_DIAGNOSIS',
      targetScope: ['SYSTEM_HEALTH', 'DATA_QUALITY', 'AI_INFERENCE_PRECISION'],
      triggeredBy: 'SCHEDULED_MONITORING',
      scheduleCycle: 'WEEKLY',
      executionTimestampUtc: new Date('2024-01-15T09:00:00Z'),
      requestId: 'req-health-check-001'
    };

    const auditLog: any[] = [];

    const mockAuditRecorder = (event: any) => {
      auditLog.push(event);
    };

    let thrownError: any;
    try {
      await runTx3Imp1Agent(
        userContext,
        healthCheckRequest,
        {
          recordAuditEvent: mockAuditRecorder
        }
      );
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.type).toBe('AUTHORIZATION_DENIED');
    expect(thrownError.message).toMatch(/チェック実行者に必要な権限がありません/);
    expect(thrownError.statusCode).toBe(403);

    const authDenialEvent = auditLog.find(
      (event) =>
        event.action === 'runTx3Imp1Agent' &&
        event.result === 'DENIED' &&
        event.reason === 'INSUFFICIENT_PERMISSION'
    );
    expect(authDenialEvent).toBeDefined();
    expect(authDenialEvent.userId).toBe('user-insufficient-perms-001');
    expect(authDenialEvent.requestId).toBe('req-health-check-001');

    expect(auditLog.filter((e) => e.action === 'HEALTH_CHECK_DIAGNOSTIC_INVOKED')).toHaveLength(0);
    expect(auditLog.filter((e) => e.action === 'DATA_QUALITY_ANALYSIS_INVOKED')).toHaveLength(0);
    expect(auditLog.filter((e) => e.action === 'AI_INFERENCE_PRECISION_EVALUATION_INVOKED')).toHaveLength(0);
    expect(auditLog.filter((e) => e.action === 'ANOMALY_AGGREGATION_COMPLETED')).toHaveLength(0);
    expect(auditLog.filter((e) => e.action === 'DIAGNOSTIC_REPORT_GENERATED')).toHaveLength(0);
  });
});