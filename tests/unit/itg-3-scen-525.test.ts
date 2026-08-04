import { calculateImprovementPriorityRanks } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-525
  test("改善優先度ランク算出機能 - 優先度判定対象が0件のときランクリストが空配列で返される", () => {
    const dealDataArray: never[] = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = calculateImprovementPriorityRanks(
      dealDataArray,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});