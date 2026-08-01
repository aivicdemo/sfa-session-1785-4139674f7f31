import { assessSystemHealthStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-236
  test('システムヘルスチェック判定機能 - システム稼働状況が正常でAIエージェント推論精度が不正常なとき複合結果がレポートに出力される', () => {
    const systemOperationStatusCheckResult = {
      operationStatus: 'normal',
      uptimePercentage: 99.5,
      checkTimestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const aiInferenceAccuracyCheckResult = {
      inferenceStatus: 'abnormal',
      successRate: 68,
      checkTimestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const healthCheckInput = {
      systemOperationStatus: systemOperationStatusCheckResult,
      aiInferenceAccuracy: aiInferenceAccuracyCheckResult,
    };

    const report = assessSystemHealthStatus(healthCheckInput);

    expect(report).toEqual({
      systemOperationStatusResult: {
        status: 'normal',
        uptimePercentage: 99.5,
      },
      aiInferenceAccuracyResult: {
        status: 'abnormal',
        successRate: 68,
      },
      overallStatus: 'caution',
      generatedAt: new Date('2024-01-15T11:00:00Z'),
    });
  });
});