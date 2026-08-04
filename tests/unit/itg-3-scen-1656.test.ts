import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1656
  test('推奨スコア算出機能 - 商談IDが空文字列のとき、エラーが発生する', () => {
    const emptyDealId = '';

    expect(() => calculateRecommendationScore(emptyDealId)).toThrow(/商談ID/);
  });
});