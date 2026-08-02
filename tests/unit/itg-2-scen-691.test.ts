import { describe, test, expect, beforeEach } from '@jest/globals';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-691
  test('推奨根拠が空配列のとき、根拠なしが正しく表現される', () => {
    const { visualizeRecommendationRationale } = require('../../src/logic/it-1-br-2-2-1-1');

    const inputData = {
      recommendationId: 'rec_001',
      customerId: 'cust_123',
      rationales: [],
    };

    const result = visualizeRecommendationRationale(inputData);

    expect(result).toEqual({
      recommendationId: 'rec_001',
      customerId: 'cust_123',
      hasRationale: false,
      rationaleCount: 0,
      displayMessage: '根拠なし',
      rationaleList: [],
    });
  });
});