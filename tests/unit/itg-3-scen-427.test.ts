import { extractImprovementItems } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善対象項目抽出機能", () => {
  // SCEN-427
  test("不整合ログが優先度順に並んでいない場合、優先度の高い順に並び替えられる", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inconsistencyLogs = [
      {
        log_id: "log-001",
        priority: "低",
        inconsistency_type: "customer_duplicate",
        detected_at: new Date("2024-01-15T10:00:00Z"),
      },
      {
        log_id: "log-002",
        priority: "高",
        inconsistency_type: "missing_field",
        detected_at: new Date("2024-01-15T10:05:00Z"),
      },
      {
        log_id: "log-003",
        priority: "中",
        inconsistency_type: "invalid_format",
        detected_at: new Date("2024-01-15T10:10:00Z"),
      },
    ];

    const result = extractImprovementItems(inconsistencyLogs, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].log_id).toBe("log-002");
    expect(result[0].priority).toBe("高");
    expect(result[1].log_id).toBe("log-003");
    expect(result[1].priority).toBe("中");
    expect(result[2].log_id).toBe("log-001");
    expect(result[2].priority).toBe("低");
  });
});