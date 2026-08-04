import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1384
  test("投資対効果スコアが計算できないときエラーメッセージを表示する", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealInput = {
      customerName: "テスト太郎",
      dealAmount: 5000000,
      industry: "製造業",
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    try {
      const result = evaluatePatternRelevance(newDealInput, mockAIEngine);

      expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();

      expect(result).toEqual({
        scoreValue: null,
        displayText: "計算不可",
        isError: true,
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringMatching(/投資対効果スコア/)
      );
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});