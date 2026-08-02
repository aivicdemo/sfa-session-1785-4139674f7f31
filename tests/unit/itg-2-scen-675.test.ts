import { describe, test, expect } from '@jest/globals';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-675
  test('推奨内容根拠の可視化機能 - 顧客IDが欠落しているとき、エラーが発生する', () => {
    const customerData = {
      customerName: '株式会社ABC',
      industryType: '製造業',
      revenue: 1000000000,
    };

    expect(() => visualizeRecommendationBasis(customerData)).toThrow(/顧客ID/);
  });
});