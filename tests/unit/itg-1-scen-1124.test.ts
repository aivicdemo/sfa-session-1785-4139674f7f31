import { monitorAiInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1124
  test('[error] AIエージェント推論精度監視データが欠落しているとき、処理がエラーになること', () => {
    const mockMonitoringData = {
      inferenceScorePercentage: null,
      evaluatedAt: new Date('2024-01-15T11:00:00Z'),
      totalInferences: 100,
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const mockAlertGenerator = {
      generateAlert: jest.fn(),
    };

    expect(() => {
      monitorAiInferenceAccuracy(
        mockMonitoringData,
        mockLogger,
        mockAlertGenerator
      );
    }).toThrow(/推論精度スコア/);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('DATA_MISSING_INFERENCE_SCORE')
    );
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('AIエージェント推論精度スコアが取得できません')
    );

    expect(mockAlertGenerator.generateAlert).not.toHaveBeenCalled();
  });
});