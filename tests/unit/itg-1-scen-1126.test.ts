import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1126
  test('監視対象の推論精度値がnullのとき、エラーが返されること', () => {
    const inferenceAccuracyData = {
      inferenceId: 'inference-001',
      precisionValue: null,
      monitoringTimestamp: new Date('2024-01-15T11:00:00Z'),
      thresholdPercentage: 95,
    };

    const result = monitorInferenceAccuracy(inferenceAccuracyData);

    expect(result.isError).toBe(true);
    expect(result.errorCode).toBe('INVALID_PRECISION_VALUE');
    expect(result.errorMessage).toBe('推論精度値が未設定です');
    expect(result.alertGenerated).toBe(false);
  });
});