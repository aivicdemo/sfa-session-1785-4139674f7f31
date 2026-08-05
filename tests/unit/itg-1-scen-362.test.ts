import { describe, test, expect, beforeEach } from '@jest/globals';
import { judgeSystemHealthCheckPassed } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-362
  test('[edge] システムヘルスチェック合格判定機能 - システム稼働率が合格基準値を超える場合に合格と判定される', () => {
    const pass_rate_threshold = 99.0;
    const current_uptime_rate = 99.5;

    const result = judgeSystemHealthCheckPassed({
      uptime_rate: current_uptime_rate,
      pass_rate_threshold: pass_rate_threshold,
    });

    expect(result.status).toBe('合格');
    expect(result.uptime_rate).toBe(99.5);
    expect(result.reason).toMatch(/稼働率|基準値/);
  });
});