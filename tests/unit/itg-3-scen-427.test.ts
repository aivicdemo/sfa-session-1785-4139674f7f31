import { extractImprovementItems } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善対象項目抽出機能", () => {
  test("SCEN-427: 不整合ログが優先度順に並んでいない場合、優先度の高い順に並び替えられる", () => {
    // テスト用の不整合ログデータセット
    const inconsistencyLogs = [
      {
        id: "log-001",
        priority: "low",
        message: "Customer data incomplete",
        timestamp: new Date("2024-01-15T10:00:00Z"),
      },
      {
        id: "log-002",
        priority: "high",
        message: "Duplicate customer detected",
        timestamp: new Date("2024-01-15T10:05:00Z"),
      },
      {
        id: "log-003",
        priority: "medium",
        message: "Invalid email format",
        timestamp: new Date("2024-01-15T10:10:00Z"),
      },
    ];

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: "Standard approach",
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue("Recommendation reasoning"),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    // 改善対象項目抽出機能を呼び出す
    const result = extractImprovementItems(
      inconsistencyLogs,
      mockAIRecommendationEngine
    );

    // 返却された不整合ログが優先度の高い順に並び替えられていることを確認
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("log-002");
    expect(result[0].priority).toBe("high");
    expect(result[1].id).toBe("log-003");
    expect(result[1].priority).toBe("medium");
    expect(result[2].id).toBe("log-001");
    expect(result[2].priority).toBe("low");
  });
});