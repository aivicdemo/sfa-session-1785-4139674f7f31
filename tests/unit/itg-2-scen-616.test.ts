import { describe, test, expect } from '@jest/globals';
import { calculateSimilarityScore } from '../../src/logic/it-1-br-2-2-1-1';

// SCEN-616
describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-616: 顧客名が1文字異なる場合、類似度スコアが計算される', () => {
    const customerNameA = '山田太郎';
    const customerNameB = '山田次郎';

    const similarityScore = calculateSimilarityScore(customerNameA, customerNameB);

    expect(similarityScore).toBeGreaterThan(0);
    expect(similarityScore).toBeLessThan(1);
    expect(similarityScore).toBeGreaterThanOrEqual(0.7);
    expect(similarityScore).toBeLessThanOrEqual(0.95);
  });
});