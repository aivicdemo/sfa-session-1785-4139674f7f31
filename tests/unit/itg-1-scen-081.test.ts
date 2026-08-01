import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { validateTrainingDataAndExecuteInference } from '../../src/logic/it-1-br-2-1-1-1';

fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-081
  it('[edge] AIエージェント推論実行前の学習データ量・品質検証機能 - 学習データが0件の場合、推論実行が保留される', async () => {
    const input = {
      trainingDataCount: 0,
      dataQualityScore: 0,
      minRequiredTrainingDataCount: 100,
      minRequiredQualityScore: 80,
    };

    const expectedResponse = {
      status: 'PENDING',
      reason: 'INSUFFICIENT_TRAINING_DATA',
      message: '学習データが0件のため推論実行は保留されています',
      recommendedAction: '学習データを登録してから推論を再実行してください',
    };

    fetchMock.mockResponseOnce(JSON.stringify(expectedResponse), { status: 202 });

    const result = await validateTrainingDataAndExecuteInference(input);

    expect(result).toEqual({
      httpStatus: 202,
      body: expectedResponse,
      inferenceJobCreated: false,
      executionHistoryRecordCreated: false,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });
});