import { runTx3Imp1Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-330
  test('[error] システムヘルスチェック実行機能 - AIエージェント推論精度チェックの合格基準が未設定のとき、エラーが発生する', async () => {
    const mockAuditLog: Array<{
      event_type: string;
      component: string;
      config_key: string;
      status: string;
      timestamp: string;
    }> = [];

    const mockContextWithNullThreshold = {
      executionId: 'test-exec-001',
      operatorId: 'mgr-2024-001',
      triggerType: 'scheduled',
      thresholdConfig: null,
      auditLogCollector: {
        log: (evt: {
          event_type: string;
          component: string;
          config_key: string;
          status: string;
        }) => {
          mockAuditLog.push({
            ...evt,
            timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
          });
        },
      },
      healthCheckResult: {
        systemStatus: 'healthy',
        checkedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      },
      dataQualityResult: {
        qualityScore: 96.5,
        checkedAt: new Date('2024-01-15T10:15:00Z').toISOString(),
      },
      transactionMarker: {
        markForRollback: (step: string) => {
          void step;
        },
      },
    };

    let thrownError: Error | null = null;
    let thrownErrorName: string | null = null;
    let thrownErrorMessage: string | null = null;

    try {
      await runTx3Imp1Agent(mockContextWithNullThreshold as any);
    } catch (err) {
      thrownError = err as Error;
      thrownErrorName = (err as any).name || 'UnknownError';
      thrownErrorMessage = (err as Error).message;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownErrorName).toBe('InferenceAccuracyThresholdNotConfiguredError');
    expect(thrownErrorMessage).toMatch(/AIエージェント推論精度チェックの合格基準/);
    expect(thrownErrorMessage).toMatch(/未設定/);
    expect(thrownErrorMessage).toMatch(/運用ルール設定画面/);

    expect(mockAuditLog.length).toBeGreaterThan(0);
    const validationErrorLog = mockAuditLog.find(
      (log) =>
        log.event_type === 'VALIDATION_ERROR' &&
        log.component === 'tx-3-imp-1-orchestrator' &&
        log.config_key === 'inferenceAccuracyThreshold' &&
        log.status === 'MISSING'
    );
    expect(validationErrorLog).toBeDefined();

    expect(thrownError?.stack).toMatch(/Tx3Imp1AiClient\.evaluateInferenceAccuracy/);
  });
});