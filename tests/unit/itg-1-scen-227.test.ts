import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-227
  test('システムヘルスチェック判定機能 - チェック基準が空のとき例外が発生する', () => {
    const emptyCriteria: Array<{
      metricName: string;
      threshold: number;
      operator: string;
    }> = [];

    const healthCheckParams = {
      criteria: emptyCriteria,
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() =>
      executeSystemHealthCheck(healthCheckParams)
    ).toThrow(/チェック基準|criteria must not be empty/);
  });
});