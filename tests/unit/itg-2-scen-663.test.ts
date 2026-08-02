import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-663
  it('推奨内容根拠の可視化機能 - 入力された推奨アプローチIDが無効なとき、エラーが発生する', async () => {
    const invalid_recommendation_approach_id = 'INVALID-ID-12345';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: '指定された推奨アプローチIDは存在しません',
        code: 'InvalidRecommendationApproachIdError',
      }),
      { status: 404 }
    );

    const invoke_visualize = async () => {
      return await visualizeRecommendationBasis({
        recommendation_approach_id: invalid_recommendation_approach_id,
      });
    };

    await expect(invoke_visualize()).rejects.toThrow(/推奨アプローチID/);
  });
});