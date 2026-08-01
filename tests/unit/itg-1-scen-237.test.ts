import { executeSystemHealthCheck } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-237
  test('[normal] システムヘルスチェック判定機能 - 営業データ品質が正常でAIエージェント推論精度が不正常なとき複合結果がレポートに出力される', async () => {
    fetchMock.resetMocks();

    const salesDataQualityResponse = {
      status: 'healthy',
      dataCompleteness: 95,
      dataConsistency: 98,
      timestamp: '2024-01-15T11:00:00Z'
    };

    const aiAgentInferenceResponse = {
      status: 'unhealthy',
      inferenceAccuracy: 62,
      responseLatency: 3500,
      timestamp: '2024-01-15T11:00:00Z'
    };

    fetchMock.mockResponseOnce(JSON.stringify(salesDataQualityResponse), { status: 200 });
    fetchMock.mockResponseOnce(JSON.stringify(aiAgentInferenceResponse), { status: 200 });

    const result = await executeSystemHealthCheck();

    expect(result.overallStatus).toBe('degraded');

    expect(result.diagnosticSummary).toContain('営業データ品質は正常ですが、AIエージェント推論精度が低下しています');

    expect(result.componentChecks).toBeInstanceOf(Array);
    expect(result.componentChecks.length).toBeGreaterThan(0);

    const salesDataQualityCheck = result.componentChecks.find(
      (component: { name: string; status: string }) => component.name === 'salesDataQuality'
    );
    expect(salesDataQualityCheck).toBeDefined();
    expect(salesDataQualityCheck.status).toBe('healthy');

    const aiAgentInferenceCheck = result.componentChecks.find(
      (component: { name: string; status: string }) => component.name === 'aiAgentInference'
    );
    expect(aiAgentInferenceCheck).toBeDefined();
    expect(aiAgentInferenceCheck.status).toBe('unhealthy');

    expect(aiAgentInferenceCheck.details).toBeDefined();
    expect(aiAgentInferenceCheck.details.inferenceAccuracy).toBe(62);
    expect(aiAgentInferenceCheck.details.responseLatency).toBe(3500);
  });
});