import { monitorAIInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-426
  test('推論精度が閾値直下の場合、アラートが発生する', () => {
    const threshold = 80;
    const currentAccuracy = 79.9;
    const expectedAlertMessage = '推論精度が閾値以下です。現在精度: 79.9%';

    const result = monitorAIInferenceAccuracy({
      threshold,
      currentAccuracy,
    });

    expect(result.alertGenerated).toBe(true);
    expect(result.alertRecords).toHaveLength(1);
    expect(result.alertRecords[0]).toEqual({
      message: expectedAlertMessage,
      severity: 'warning',
      threshold: 80,
      currentAccuracy: 79.9,
      timestamp: expect.any(String),
    });
  });
});