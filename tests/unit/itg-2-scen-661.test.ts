import { describe, test, expect } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { getRecommendationHistoryForVisualization } from '../../src/logic/it-1-br-2-2-1-1';

fetchMock.enableMocks();

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-661: 推奨内容根拠の可視化機能 - 推奨履歴から過去推奨内容が0件のとき、推奨履歴なしを示すデータが返される', async () => {
    const customer_id = 'CUST-20240115-001';
    const expected_status = 200;
    const expected_message = '推奨履歴がありません';

    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(
      JSON.stringify({
        recommendationHistory: [],
        recommendationAvailable: false,
        message: expected_message
      }),
      { status: expected_status }
    );

    const result = await getRecommendationHistoryForVisualization(customer_id);

    expect(result.status).toBe(expected_status);
    expect(result.body.recommendationHistory).toEqual([]);
    expect(result.body.recommendationAvailable).toBe(false);
    expect(result.body.message).toBe(expected_message);
  });
});