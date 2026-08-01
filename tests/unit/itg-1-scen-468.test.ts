import { describe, test, expect } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-468
  test('同じ推論に対して複数回精度監視を実行した場合、毎回同じアラート判定結果が得られる', () => {
    const inferenceResult = {
      inferenceId: 'inf-20240115-001',
      predictionScore: 72.5,
      modelVersion: '2.1.0',
      executedAt: new Date('2024-01-15T10:30:00Z'),
    };

    const alertThreshold = {
      accuracyLowerBound: 70.0,
      severityLevel: 'warning',
    };

    const firstMonitoringResult = monitorInferenceAccuracy(
      inferenceResult,
      alertThreshold
    );

    const secondMonitoringResult = monitorInferenceAccuracy(
      inferenceResult,
      alertThreshold
    );

    const thirdMonitoringResult = monitorInferenceAccuracy(
      inferenceResult,
      alertThreshold
    );

    expect(firstMonitoringResult.alertTriggered).toBe(
      secondMonitoringResult.alertTriggered
    );
    expect(secondMonitoringResult.alertTriggered).toBe(
      thirdMonitoringResult.alertTriggered
    );

    expect(firstMonitoringResult.alertTriggered).toBe(false);

    expect(firstMonitoringResult.alertType).toBe(
      secondMonitoringResult.alertType
    );
    expect(secondMonitoringResult.alertType).toBe(
      thirdMonitoringResult.alertType
    );

    expect(firstMonitoringResult.judgeReason).toBe(
      secondMonitoringResult.judgeReason
    );
    expect(secondMonitoringResult.judgeReason).toBe(
      thirdMonitoringResult.judgeReason
    );

    expect(firstMonitoringResult.judgeReason).toBe(
      'Prediction score 72.5 is within acceptable range [70.0, 100.0]'
    );
  });
});