import { generateSuccessPatternTemplate } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 成功パターンテンプレート設計", () => {
  test("SCEN-2500: 営業プロセスステップが空配列のとき、テンプレート生成がエラーになる", () => {
    // Arrange
    const emptyProcessSteps: string[] = [];
    
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act & Assert
    const result = generateSuccessPatternTemplate(emptyProcessSteps, stubAIEngine);

    // Assert - テンプレート生成がエラーを返すことを検証
    expect(result).toHaveProperty("error");
    expect(result.error).toEqual({
      code: "INVALID_PROCESS_STEPS",
      message: "Sales process steps cannot be empty",
    });

    // Assert - generateRecommendationが呼び出されていないことを検証
    expect(stubAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // Assert - テンプレートが生成されていないことを検証
    expect(result).not.toHaveProperty("template");
  });
});