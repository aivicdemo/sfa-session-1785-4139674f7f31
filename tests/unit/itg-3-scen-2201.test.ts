import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2201
  test("顧客対応の接触パターンの分析 - 接触回数がちょうど成功パターンと同じとき、マッチスコアが100", () => {
    const successPatternContactCount = 5;
    const actualContactCount = 5;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((input) => {
        const contactCountMatchScore =
          input.actualContactCount === input.successPatternContactCount
            ? 100
            : Math.max(
                0,
                100 -
                  Math.abs(
                    input.actualContactCount -
                      input.successPatternContactCount
                  ) * 10
              );

        return {
          overallRelevanceScore: contactCountMatchScore,
          contactCountMatchScore: contactCountMatchScore,
          details: {
            successPatternContactCount:
              input.successPatternContactCount,
            actualContactCount: input.actualContactCount,
          },
        };
      }),
    };

    const analysisInput = {
      successPatternContactCount: successPatternContactCount,
      actualContactCount: actualContactCount,
    };

    const result = evaluatePatternRelevance(
      analysisInput,
      mockAIRecommendationEngine
    );

    expect(typeof result.contactCountMatchScore).toBe("number");
    expect(result.contactCountMatchScore).toBe(100);
    expect(result.overallRelevanceScore).toBe(100);
    expect(result.details.successPatternContactCount).toBe(5);
    expect(result.details.actualContactCount).toBe(5);
  });
});