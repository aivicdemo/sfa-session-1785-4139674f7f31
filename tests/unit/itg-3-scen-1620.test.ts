import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1620
  test("[edge] 推奨内容の根拠表示 - AIエージェント外部連携が失敗したとき、根拠説明の簡略版が表示される", async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(async () => {
        throw new Error("API_TIMEOUT");
      }),
    };

    const mockPatternMaster = [
      {
        patternId: "P001",
        successRate: 87,
        description: "製造業向け初期接触パターン",
      },
      {
        patternId: "P002",
        successRate: 82,
        description: "予算規模500万円帯の商談パターン",
      },
      {
        patternId: "P003",
        successRate: 78,
        description: "意思決定者3名規模の合意形成パターン",
      },
    ];

    const newDeal = {
      customerIndustry: "製造業",
      budgetAmount: 5000000,
      decisionMakers: 3,
      patternMaster: mockPatternMaster,
      aiEngine: mockAIRecommendationEngine,
    };

    const result = await explainRecommendationReasoning(newDeal);

    expect(result).toHaveProperty("reasoning");
    expect(typeof result.reasoning).toBe("string");
    expect(result.reasoning.length).toBeLessThanOrEqual(200);
    expect(result.reasoning).toContain("P001");
    expect(result.reasoning).toContain("87%");
    expect(result.reasoning).toContain("P002");
    expect(result.reasoning).toContain("82%");
    expect(result.reasoning).toContain("P003");
    expect(result.reasoning).toContain("78%");
    expect(result).not.toHaveProperty("error");
    expect(result.reasoning).not.toContain("詳細");
    expect(result.reasoning).not.toContain("OpenAI");
  });
});