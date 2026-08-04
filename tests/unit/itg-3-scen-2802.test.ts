import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2802
  test('[error] 推奨根拠の可視化機能 - 根拠の信頼度スコアが1を超えるとき、エラーを返す', () => {
    const invalidCredibilityScore = 1.5;

    expect(() => {
      evaluatePatternRelevance(invalidCredibilityScore);
    }).toThrow(/CREDIBILITY_SCORE_OUT_OF_RANGE/);

    expect(() => {
      evaluatePatternRelevance(invalidCredibilityScore);
    }).toThrow(/根拠の信頼度スコア/);

    expect(() => {
      evaluatePatternRelevance(invalidCredibilityScore);
    }).toThrow(/1.5/);
  });
});