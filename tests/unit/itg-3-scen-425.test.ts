import { extractImprovementTargets } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善対象項目抽出機能", () => {
  // SCEN-425
  test("不整合ログが複数件の場合、全対象項目が正しく抽出される", () => {
    // Mock AIRecommendationEngine
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn((fieldName: string): number => {
        const scoreMap: { [key: string]: number } = {
          "顧客名": 0.95,
          "提案金額": 0.87,
          "フォローメール送信日": 0.72,
        };
        return scoreMap[fieldName] ?? 0.0;
      }),
    };

    // Prepare test data: 3 inconsistency logs
    const inconsistencyLogs = [
      {
        logId: "L001",
        fieldName: "顧客名",
        expectedValue: "株式会社A",
        actualValue: "株式会社B",
      },
      {
        logId: "L002",
        fieldName: "提案金額",
        expectedValue: "1000万円",
        actualValue: "900万円",
      },
      {
        logId: "L003",
        fieldName: "フォローメール送信日",
        expectedValue: "2026-08-05",
        actualValue: "2026-08-06",
      },
    ];

    // Execute extraction function
    const result = extractImprovementTargets(
      inconsistencyLogs,
      aiRecommendationEngineStub
    );

    // Verify: All 3 improvement target items are extracted
    expect(result).toHaveLength(3);

    // Verify: Items are sorted by relevance score in descending order
    expect(result[0]).toEqual({
      fieldName: "顧客名",
      logId: "L001",
      relevanceScore: 0.95,
    });
    expect(result[1]).toEqual({
      fieldName: "提案金額",
      logId: "L002",
      relevanceScore: 0.87,
    });
    expect(result[2]).toEqual({
      fieldName: "フォローメール送信日",
      logId: "L003",
      relevanceScore: 0.72,
    });

    // Verify: Scores are in descending order
    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(result[1].relevanceScore).toBeGreaterThan(result[2].relevanceScore);

    // Verify: AIRecommendationEngine was called for each field
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith("顧客名");
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith("提案金額");
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith("フォローメール送信日");
  });
});