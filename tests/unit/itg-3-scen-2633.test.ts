import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2633: 推奨根拠が空のとき、可視化エラーが発生する', () => {
    const recommendation = {
      recommendation: '営業提案アプローチA',
      reasoning: ''
    };

    expect(() => {
      visualizeRecommendationReasoning(recommendation);
    }).toThrow(/推奨根拠/);
  });
});