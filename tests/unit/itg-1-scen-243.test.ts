import { calculateSystemHealthScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-243
  test('システムヘルスチェック判定機能で合格基準が負数の場合は例外を発生させる', () => {
    const healthCheckParams = {
      uptime_threshold: -0.5,
      data_quality_threshold: 0.95,
      inference_accuracy_threshold: 0.90,
    };

    expect(() => calculateSystemHealthScore(healthCheckParams)).toThrow(/合格基準|Threshold|非負/);
  });
});