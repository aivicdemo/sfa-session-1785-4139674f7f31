import { it, describe, expect, beforeEach } from '@jest/globals';
import { validateAlertThresholdAndGenerateAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1042
  it('アラート閾値設定が欠落しているときアラート生成判定がエラーになること', () => {
    const inferenceScore = 0.75;
    const nullThresholdConfig = null;

    expect(() => {
      validateAlertThresholdAndGenerateAlert({
        inferenceScore,
        thresholdConfig: nullThresholdConfig,
      });
    }).toThrow(/アラート閾値設定/);
  });
});