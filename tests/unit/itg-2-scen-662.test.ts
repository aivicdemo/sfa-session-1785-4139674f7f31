import { describe, test, expect, beforeEach } from '@jest/globals';
const fetchMock = require('jest-fetch-mock');

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-662: [normal] 推奨内容根拠の可視化機能 - 入力された推奨アプローチIDが有効なとき、対応する推奨データが取得される
  test('should retrieve recommendation visibility data with valid approach ID', async () => {
    const validApproachId = 'APP-001';
    const expectedRecommendationData = {
      recommendationName: '顧客分析の強化',
      recommendationCategory: '営業戦略',
      basis: '過去3ヶ月の成約率が15%低下',
      status: '有効'
    };

    fetchMock.mockResponseOnce(JSON.stringify(expectedRecommendationData), {
      status: 200
    });

    const { getRecommendationBasisVisibility } = await import(
      '../../src/logic/it-1-br-2-2-1-1'
    );

    const result = await getRecommendationBasisVisibility(validApproachId);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      recommendationName: '顧客分析の強化',
      recommendationCategory: '営業戦略',
      basis: '過去3ヶ月の成約率が15%低下',
      status: '有効'
    });
    expect(result.recommendationName).toBe('顧客分析の強化');
    expect(result.recommendationCategory).toBe('営業戦略');
    expect(result.basis).toBe('過去3ヶ月の成約率が15%低下');
    expect(result.status).toBe('有効');
  });
});