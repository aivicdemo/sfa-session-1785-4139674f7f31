import { generateTemplateFromSuccessPattern } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 成功パターンテンプレート設計", () => {
  test("SCEN-2512: 成功パターンの構造化定義がnullのとき、テンプレート生成がエラーになる", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const nullStructuredPattern = null;

    expect(() => {
      generateTemplateFromSuccessPattern(nullStructuredPattern, mockAIEngine);
    }).toThrow(/成功パターンの構造化定義/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});