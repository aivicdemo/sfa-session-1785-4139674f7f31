import { describe, test, expect } from '@jest/globals';
import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-506
  test('[normal] AIエージェント推論精度スコア算出機能 - 同じ入力で精度スコア算出を2回実行した場合、同じスコアが算出される', () => {
    const testDealData = {
      dealId: 'TEST-001',
      salesRepName: '営業太郎',
      proposalContent: '標準プラン',
      customerIndustry: '製造業'
    };

    const scoreFirst = calculateInferenceAccuracyScore(testDealData);
    const scoreSecond = calculateInferenceAccuracyScore(testDealData);

    expect(scoreFirst).toBe(scoreSecond);
  });
});