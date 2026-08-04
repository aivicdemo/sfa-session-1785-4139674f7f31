import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1574: AIエージェント呼び出しがタイムアウトしたとき、代替処理が実行される", async () => {
    // Mock AIRecommendationEngine with timeout
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("Request timeout"));
            }, 30000);
          })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Mock pattern master data (top 3 statistical success patterns)
    const mockPatternMaster = [
      {
        pattern_id: "PAT-001",
        success_rate: 0.82,
        customer_segment: "mid_market",
        industry: "manufacturing",
        reasoning_full:
          "This pattern shows high success rates in mid-market manufacturing sectors due to strong alignment with operational efficiency priorities and multi-year budget cycles. Historical data indicates 82% closure rate with average deal size of 5M yen.",
        reasoning_brief: "Mid-market manufacturing alignment. 82% closure rate.",
      },
      {
        pattern_id: "PAT-002",
        success_rate: 0.78,
        customer_segment: "enterprise",
        industry: "finance",
        reasoning_full:
          "Enterprise finance customers prioritize compliance and security frameworks. This pattern emphasizes risk mitigation and regulatory adherence, demonstrating 78% success rate with strong stakeholder engagement.",
        reasoning_brief: "Finance compliance focus. 78% closure rate.",
      },
      {
        pattern_id: "PAT-003",
        success_rate: 0.75,
        customer_segment: "mid_market",
        industry: "healthcare",
        reasoning_full:
          "Healthcare mid-market organizations require specialized change management and staff training during implementation. This pattern incorporates extended support phases and achieves 75% closure rate.",
        reasoning_brief: "Healthcare change management. 75% closure rate.",
      },
    ];

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Test input: new business case data
    const dealInput = {
      customer_id: "CUST-20240115-001",
      customer_name: "Sample Manufacturing Corp",
      industry: "manufacturing",
      company_size: "mid_market",
      annual_revenue: 2500000000,
      deal_stage: "needs_analysis",
      deal_value: 4800000,
      decision_timeline_days: 120,
      key_pain_points: [
        "operational_efficiency",
        "cost_reduction",
        "supply_chain_visibility",
      ],
      stakeholder_count: 5,
      prior_vendor_experience: "positive",
    };

    // Call visualization function with mocked dependencies and simulate timeout
    const result = await visualizeRecommendationReasoning(
      dealInput,
      mockAIEngine,
      mockPatternMaster,
      mockFileStorage
    );

    // Verify timeout handling - no retry attempts made
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // Verify fallback to pattern master returns top 3 patterns
    expect(result.fallback_applied).toBe(true);
    expect(result.recommended_patterns).toHaveLength(3);

    // Verify pattern order by success rate (descending)
    expect(result.recommended_patterns[0].pattern_id).toBe("PAT-001");
    expect(result.recommended_patterns[0].success_rate).toBe(0.82);
    expect(result.recommended_patterns[1].pattern_id).toBe("PAT-002");
    expect(result.recommended_patterns[1].success_rate).toBe(0.78);
    expect(result.recommended_patterns[2].pattern_id).toBe("PAT-003");
    expect(result.recommended_patterns[2].success_rate).toBe(0.75);

    // Verify brief reasoning is used (50% or less of full version)
    const fullReasoningLength =
      mockPatternMaster[0].reasoning_full.length;
    const briefReasoningLength =
      result.recommended_patterns[0].explanation.length;
    expect(briefReasoningLength).toBeLessThanOrEqual(
      Math.ceil(fullReasoningLength * 0.5)
    );
    expect(result.recommended_patterns[0].explanation).toBe(
      "Mid-market manufacturing alignment. 82% closure rate."
    );

    // Verify user-facing message for timeout fallback
    expect(result.user_message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    // Verify no retry mechanism was triggered
    expect(result.retry_attempted).toBe(false);

    // Verify response structure
    expect(result).toHaveProperty("fallback_applied");
    expect(result).toHaveProperty("recommended_patterns");
    expect(result).toHaveProperty("user_message");
    expect(result).toHaveProperty("retry_attempted");
  });
});