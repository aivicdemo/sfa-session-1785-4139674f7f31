import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - OpenAI API失敗時の代替処理", () => {
  // SCEN-104
  test("OpenAI APIが失敗時に指数バックオフで最大3回再試行し、その後内部パターンマスタから統計上位パターンを返却する", async () => {
    // Mock AIRecommendationEngine
    const mockEngineWithFailure = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Track retry attempts
    let apiCallAttempt = 0;
    mockEngineWithFailure.generateRecommendation.mockImplementation(
      async () => {
        apiCallAttempt++;
        if (apiCallAttempt < 4) {
          // Simulate OpenAI API 500 error for first 3 attempts
          const error = new Error("OpenAI API Error");
          (error as any).status = 500;
          throw error;
        }
        // Would not reach here in this test - expects fallback
        return null;
      }
    );

    // Input customer and deal conditions
    const inputParams = {
      customerId: "CUST-20240115-001",
      industry: "製造業",
      companySize: "中堅",
      dealAmount: 5000000,
      dealStage: "提案段階",
      customerNeeds: ["生産効率向上", "品質管理"],
      engine: mockEngineWithFailure,
    };

    // Expected internal pattern master data (top 3 by success rate from historical 120 deals)
    const expectedInternalPatterns = [
      {
        patternId: "PATTERN-001",
        industryMatch: "製造業",
        sizeMatch: "中堅",
        approachType: "効率化提案",
        successRate: 0.78,
        applicationConditions: "売上5000万円以上、IT投資意欲あり",
        estimatedClosureRate: 78,
        historicalDealCount: 45,
      },
      {
        patternId: "PATTERN-002",
        industryMatch: "製造業",
        sizeMatch: "中堅",
        approachType: "品質管理提案",
        successRate: 0.72,
        applicationConditions: "品質課題が明確に定義されている",
        estimatedClosureRate: 72,
        historicalDealCount: 38,
      },
      {
        patternId: "PATTERN-003",
        industryMatch: "製造業",
        sizeMatch: "中堅",
        approachType: "統合効率化提案",
        successRate: 0.68,
        applicationConditions: "複数課題の統合解決が可能",
        estimatedClosureRate: 68,
        historicalDealCount: 37,
      },
    ];

    const userDisplayMessage =
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します";

    // Call function - should trigger fallback after 3 failed retries
    const result = await generateRecommendation(inputParams);

    // Verify retry attempts (exponential backoff: 1s, 2s, 4s = 3 attempts)
    expect(mockEngineWithFailure.generateRecommendation).toHaveBeenCalledTimes(
      3
    );

    // Verify returned data contains top 3 patterns from internal master
    expect(result.recommendations).toHaveLength(3);
    expect(result.recommendations[0].patternId).toBe("PATTERN-001");
    expect(result.recommendations[0].successRate).toBe(0.78);
    expect(result.recommendations[0].estimatedClosureRate).toBe(78);
    expect(result.recommendations[0].approachType).toBe("効率化提案");

    expect(result.recommendations[1].patternId).toBe("PATTERN-002");
    expect(result.recommendations[1].successRate).toBe(0.72);
    expect(result.recommendations[1].estimatedClosureRate).toBe(72);

    expect(result.recommendations[2].patternId).toBe("PATTERN-003");
    expect(result.recommendations[2].successRate).toBe(0.68);
    expect(result.recommendations[2].estimatedClosureRate).toBe(68);

    // Verify simplified reasoning (not full version)
    expect(result.recommendations[0].reasoning).toBeDefined();
    expect(result.recommendations[0].reasoning).toContain("PATTERN-001");
    expect(result.recommendations[0].reasoning).toContain("効率化提案");
    expect(result.recommendations[0].reasoning).toContain("78");
    expect(result.recommendations[0].reasoning).not.toContain(
      "詳細な根拠分析"
    );

    // Verify user-facing message for delayed generation
    expect(result.userMessage).toBe(userDisplayMessage);

    // Verify fallback source indicator
    expect(result.source).toBe("internal_pattern_master_fallback");

    // Verify that all returned patterns have application conditions
    result.recommendations.forEach((rec: any) => {
      expect(rec.applicationConditions).toBeDefined();
      expect(rec.applicationConditions.length).toBeGreaterThan(0);
    });

    // Verify historical deal count in patterns (statistical basis)
    expect(result.recommendations[0].historicalDealCount).toBe(45);
    expect(result.recommendations[1].historicalDealCount).toBe(38);
    expect(result.recommendations[2].historicalDealCount).toBe(37);
  });
});