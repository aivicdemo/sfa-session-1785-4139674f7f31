import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2565
  test('推奨内容IDが欠落しているとき、例外が発生する', () => {
    const engine = new AIRecommendationEngine();
    
    expect(() => {
      engine.explainRecommendationReasoning(null);
    }).toThrow(/推奨内容ID/);
    
    expect(() => {
      engine.explainRecommendationReasoning(undefined);
    }).toThrow(/推奨内容ID/);
  });
});