import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2799
  test("推奨根拠のテキストが空文字列のとき、エラーを返す", () => {
    const emptyReasoningText = "";

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(emptyReasoningText),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      explainRecommendationReasoning(emptyReasoningText, mockAIEngine)
    ).toThrow(/InvalidReasoningText/);

    try {
      explainRecommendationReasoning(emptyReasoningText, mockAIEngine);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "推奨根拠のテキストが空です。有効な根拠テキストを入力してください"
        );
      }
    }
  });
});