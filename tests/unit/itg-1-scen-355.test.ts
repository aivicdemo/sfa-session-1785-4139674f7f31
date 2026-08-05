import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

describe('システムヘルスチェック合格判定機能', () => {
  // SCEN-355
  test('[edge] AIエージェント推論精度が合格基準値直下の場合に不合格と判定される', () => {
    const health_check_pass_threshold_pct = 80.0;
    const ai_agent_inference_accuracy_pct = 79.9;

    const result = evaluateSystemHealthCheck({
      ai_agent_inference_accuracy_pct,
      health_check_pass_threshold_pct,
    });

    expect(result.status).toBe('FAILED');
    expect(result.reason).toMatch(/AIエージェント推論精度/);
    expect(result.reason).toMatch(/79\.9%/);
    expect(result.reason).toMatch(/80\.0%/);
    expect(result.reason).toMatch(/下回/);
  });
});