import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateInferenceConfidenceFromScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-761
  test('推論精度スコアが0点のとき信頼度はゼロと判定される', () => {
    const inference_score = 0;

    const result = calculateInferenceConfidenceFromScore(inference_score);

    expect(result.confidence_value).toBe(0.0);
    expect(result.confidence_status).toBe('ゼロ信頼度');
  });
});