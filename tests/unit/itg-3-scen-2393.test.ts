import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2393
  test('推論精度スコア算出機能 - 推論精度スコアが負の値となり、0未満のとき、エラーが発生する', () => {
    const negativeScore = -0.5;

    expect(() => {
      evaluateRecommendationAccuracy(negativeScore);
    }).toThrow(/推論精度スコア/);
  });
});