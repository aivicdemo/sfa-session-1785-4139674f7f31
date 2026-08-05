import { it, describe, beforeEach, afterEach } from '@jest/globals';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論実行前データ品質検証機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-139: [error] AIエージェント推論実行前データ品質検証機能 - 学習データ集計サービスが停止しているとき推論実行が保留される
  it('should hold inference request and return DS_SERVICE_UNAVAILABLE when learning data aggregation service is down', async () => {
    const { validateInferenceExecutability } = await import(
      '../../src/logic/it-1-br-2-1-1-1'
    );

    // Mock the learning data aggregation service as DOWN (timeout/connection refused)
    fetchMock.mockRejectOnce(new Error('Connection refused'));

    const inferenceRequest = {
      agentId: 'agent-test-001',
      targetPeriodStart: '2024-01-01',
      targetPeriodEnd: '2024-01-31',
      executionUserId: 'manager-001',
    };

    const result = await validateInferenceExecutability(inferenceRequest);

    expect(result.status).toBe('PendingForDataService');
    expect(result.errorCode).toBe('DS_SERVICE_UNAVAILABLE');
    expect(result.statusMessage).toMatch(/学習データ集計サービスの復帰を待機中/);
    expect(result.inferenceExecuted).toBe(false);
  });
});