import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2501
  test('[error] 成功パターンテンプレート設計機能 - 成功要因が空配列のとき、テンプレート生成がエラーになる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const successFactors: string[] = [];

    expect(() => {
      generateSuccessPatternTemplate(successFactors, mockAIEngine);
    }).toThrow(/成功要因/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});