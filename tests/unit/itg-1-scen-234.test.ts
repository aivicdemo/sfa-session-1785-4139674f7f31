import { calculateSystemHealthCheckStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-234
  test('システムヘルスチェック判定機能 - AIエージェント推論精度が100%のとき合格判定が出力される', () => {
    const inferencePrecision = 100;

    const result = calculateSystemHealthCheckStatus({
      inferencePrecision,
    });

    expect(result.status).toBe('PASS');
    expect(result.details.inferencePrecision).toBe(100);
    expect(result.details.healthCheckResult).toBe('合格');
  });
});