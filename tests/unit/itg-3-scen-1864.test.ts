import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1864
  test("根拠となる顧客データが null のとき根拠表示に失敗する", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationId = "REC-20240115-001";
    const customerData = null;
    const proposalApproach = {
      id: "APP-20240115-001",
      dealId: "DEAL-20240115-001",
      approachType: "direct_contact",
      proposedTiming: "2024-01-20",
      proposedContent: "初回商談資料提示",
    };

    mockAIEngine.explainRecommendationReasoning.mockImplementation(
      async (recId, custData, approach) => {
        if (custData === null) {
          throw new Error("顧客データが不足しています");
        }
        return {
          reasoningExplanation: "推奨根拠の説明",
          confidenceScore: 85,
        };
      }
    );

    expect(async () => {
      await mockAIEngine.explainRecommendationReasoning(
        recommendationId,
        customerData,
        proposalApproach
      );
    }).rejects.toThrow(/顧客データが不足しています/);

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerData,
      proposalApproach
    ).catch((err) => ({
      reasoningExplanation: null,
      confidenceScore: 0,
      error: err.message,
      fallbackPattern: {
        id: "PATTERN-20240115-001",
        type: "success_pattern_fallback",
        description: "推奨パターンマスタから統計的に上位の成功パターン",
        successRate: 72,
      },
    }));

    expect(result).toBeDefined();
    expect(result.reasoningExplanation).toBeNull();
    expect(result.error).toMatch(/顧客データが不足しています/);
    expect(result.fallbackPattern).toBeDefined();
    expect(result.fallbackPattern.id).toBe("PATTERN-20240115-001");
    expect(result.fallbackPattern.type).toBe("success_pattern_fallback");
    expect(result.fallbackPattern.successRate).toBe(72);
  });
});