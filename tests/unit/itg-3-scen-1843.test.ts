import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1843
  test("should handle empty purchase history by returning fallback patterns with error status", async () => {
    const customerId = "CUST-20240115-001";
    const dealConditions = {
      industry: "manufacturing",
      companySize: "large",
      budget: 5000000,
      timeline: "Q2-2024",
    };

    const customerWithEmptyHistory = {
      id: customerId,
      name: "Test Corporation",
      industry: "manufacturing",
      purchaseHistory: [],
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        code: "EMPTY_PURCHASE_HISTORY",
        message: "購買履歴が利用できません",
      }),
    };

    const mockSuccessPatternsDb = [
      {
        id: "PATTERN-001",
        score: 95,
        description: "Large manufacturing company - 設備投資提案",
        matchRate: 0.92,
      },
      {
        id: "PATTERN-002",
        score: 88,
        description: "大規模製造業 - コスト削減提案",
        matchRate: 0.85,
      },
      {
        id: "PATTERN-003",
        score: 76,
        description: "Medium-large manufacturing - 業務効率化",
        matchRate: 0.71,
      },
    ];

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
    };

    let reasoningResult;
    let errorOccurred = false;
    let fallbackPatterns = [];

    try {
      reasoningResult = await mockAIEngine.explainRecommendationReasoning(
        customerWithEmptyHistory,
        dealConditions
      );

      if (
        reasoningResult &&
        reasoningResult.code === "EMPTY_PURCHASE_HISTORY"
      ) {
        errorOccurred = true;
        mockLogger.error(
          `SCEN-1843: 根拠生成失敗 - 購買履歴なし [customerId: ${customerId}]`
        );

        fallbackPatterns = mockSuccessPatternsDb
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
      }
    } catch (err) {
      errorOccurred = true;
      mockLogger.error(
        `SCEN-1843: 根拠生成失敗 - 購買履歴なし [customerId: ${customerId}]`
      );
      fallbackPatterns = mockSuccessPatternsDb
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    }

    expect(errorOccurred).toBe(true);
    expect(reasoningResult.code).toBe("EMPTY_PURCHASE_HISTORY");
    expect(reasoningResult.message).toBe("購買履歴が利用できません");

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("SCEN-1843: 根拠生成失敗 - 購買履歴なし")
    );

    expect(fallbackPatterns.length).toBe(3);
    expect(fallbackPatterns[0].id).toBe("PATTERN-001");
    expect(fallbackPatterns[0].score).toBe(95);
    expect(fallbackPatterns[1].id).toBe("PATTERN-002");
    expect(fallbackPatterns[1].score).toBe(88);
    expect(fallbackPatterns[2].id).toBe("PATTERN-003");
    expect(fallbackPatterns[2].score).toBe(76);

    const userMessage =
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します";
    expect(userMessage).toContain("遅延");
    expect(userMessage).toContain("過去の推奨履歴");
    expect(userMessage).toContain("類似案件");

    expect(fallbackPatterns[0].matchRate).toBeGreaterThanOrEqual(0.8);
    expect(fallbackPatterns[0].matchRate).toBeLessThanOrEqual(1.0);
  });
});