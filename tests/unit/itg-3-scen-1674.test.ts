import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-1674: 推奨根拠情報が空オブジェクトのとき、エラーが発生する', () => {
    const emptyRecommendationReasoning = {};

    expect(() => {
      explainRecommendationReasoning(emptyRecommendationReasoning as any);
    }).toThrow(/必須プロパティ/);
  });
});