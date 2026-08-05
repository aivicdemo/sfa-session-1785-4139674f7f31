import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { executeHealthCheckJudgment } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-312
  test('[normal] システムヘルスチェック判定機能 - システム稼働状況が合格でAIエージェント推論精度が合格の組み合わせでレポート生成される', async () => {
    const checkExecutionId = 'check_exec_20240115_001';
    const systemOperationStatus = 'PASS';
    const systemOperationScore = 98;
    const aiInferenceAccuracyStatus = 'PASS';
    const aiInferenceAccuracyScore = 96;
    const dataQualityStatus = 'PASS';
    const dataQualityScore = 97;
    const reportGeneratedAt = '2024-01-15T11:00:00Z';
    const expectedOverallStatus = 'PASS';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        checkExecutionId,
        systemOperationStatus,
        systemOperationScore,
        aiInferenceAccuracyStatus,
        aiInferenceAccuracyScore,
        dataQualityStatus,
        dataQualityScore,
        reportGeneratedAt,
        overallStatus: expectedOverallStatus,
      }),
      { status: 200 }
    );

    const result = await executeHealthCheckJudgment({
      checkExecutionId,
      systemOperationStatus,
      systemOperationScore,
      aiInferenceAccuracyStatus,
      aiInferenceAccuracyScore,
      dataQualityStatus,
      dataQualityScore,
    });

    expect(result).toBeDefined();
    expect(result.overallStatus).toBe('PASS');
    expect(result.systemOperationStatus).toBe('PASS');
    expect(result.aiInferenceAccuracyStatus).toBe('PASS');
    expect(result.dataQualityStatus).toBe('PASS');
    expect(result.systemOperationScore).toBe(98);
    expect(result.aiInferenceAccuracyScore).toBe(96);
    expect(result.dataQualityScore).toBe(97);
    expect(result.reportGeneratedAt).toBe('2024-01-15T11:00:00Z');
  });
});