import { monitorAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-727: [edge] 営業担当者の行動パターン分析とAIエージェント推論精度監視 - AIエージェント推論精度がちょうど合格閾値と一致する場合のアラート判定境界を検証
  test('推論精度がちょうど合格閾値と一致する場合、アラートが発火されず合格判定となる', () => {
    const accuracyThreshold = 75.0;
    const aiInferenceAccuracy = 75.0;
    const systemLogs: string[] = [];

    const mockLogger = {
      info: (message: string) => {
        systemLogs.push(message);
      },
    };

    const result = monitorAiAgentInferenceAccuracy(
      {
        inferenceAccuracy: aiInferenceAccuracy,
        threshold: accuracyThreshold,
        logger: mockLogger,
      }
    );

    expect(result.alertTriggered).toBe(false);
    expect(result.status).toBe('合格');
    expect(result.accuracy).toBe(75.0);
    expect(result.threshold).toBe(75.0);
    expect(systemLogs).toContainEqual(
      expect.stringContaining('精度判定: 75.0% (閾値: 75.0%) - 合格')
    );
  });
});