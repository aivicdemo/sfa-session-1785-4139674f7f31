import { calculateInferenceAccuracyStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-307: システムヘルスチェック判定機能 - AIエージェント推論精度が合格基準内であることが判定される', () => {
    // Arrange
    const inference_accuracy = 0.92;
    const pass_threshold = 0.80;

    // Act
    const result = calculateInferenceAccuracyStatus({
      inference_accuracy,
      pass_threshold,
    });

    // Assert
    expect(result.status).toBe('PASS');
    expect(result.reason).toBe(
      'AIエージェント推論精度が合格基準内（実績0.92、基準0.80）'
    );
    expect(result.actual_accuracy).toBe(0.92);
    expect(result.threshold).toBe(0.80);
  });
});