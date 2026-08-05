import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-565
  test('[error] アラート設定が欠落している場合、エラーになる', () => {
    const alertConfig = null;

    expect(() => monitorAiInferenceAccuracy({ alertConfig })).toThrow(/ALERT_CONFIG_MISSING/);
  });
});