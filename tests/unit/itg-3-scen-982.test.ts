import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-982
  test("AIRecommendationEngine の findSimilarPatterns が API エラーを返すとき、内部推奨パターンマスタから統計的上位パターンが返される", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error("API Error: HTTP 429 Too Many Requests")
      ),
    };

    const dealCondition = {
      industry: "製造業",
      budget: 5000000,
      decisionDeadlineMonths: 3,
    };

    const internalPatternMaster = [
      { patternId: "A", successRate: 0.85, caseCount: 120 },
      { patternId: "B", successRate: 0.78, caseCount: 95 },
      { patternId: "C", successRate: 0.72, caseCount: 60 },
    ];

    const result = await findSimilarPatterns(
      dealCondition,
      mockAIEngine,
      internalPatternMaster
    );

    expect(result).toEqual([
      { patternId: "A", successRate: 0.85, caseCount: 120 },
      { patternId: "B", successRate: 0.78, caseCount: 95 },
      { patternId: "C", successRate: 0.72, caseCount: 60 },
    ]);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealCondition
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});