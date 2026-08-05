import { it, describe, expect, beforeEach } from '@jest/globals';
import { monitorAiInferencePrecisionAndAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1130
  it('監視対象期間の開始日時が欠落しているとき、処理がエラーになること', () => {
    const monitoringRuleId = 'rule-001';
    const startDateTime = null;
    const endDateTime = new Date('2024-01-31T23:59:59Z');
    const thresholdPrecision = 85;
    const thresholdDataQualityScore = 90;

    const result = monitorAiInferencePrecisionAndAlert({
      monitoringRuleId,
      startDateTime,
      endDateTime,
      thresholdPrecision,
      thresholdDataQualityScore,
    });

    expect(result).toEqual({
      success: false,
      errorCode: 'MISSING_START_DATETIME',
      errorMessage: '監視対象期間の開始日時が指定されていません',
      alertsSent: false,
    });
  });
});