import { describe, test, expect } from '@jest/globals';
import { determineAlertRecipients } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-693
  test('アラート設定が存在しないとき通知先の決定に失敗しエラーになる', () => {
    const input = {
      alertConfigs: [],
      inferenceAccuracy: 0.82,
      accuracyThreshold: 0.95,
      detectedAnomalies: ['inference_accuracy_below_threshold']
    };

    expect(() => determineAlertRecipients(input)).toThrow(/ALERT_CONFIG_NOT_FOUND/);
  });
});