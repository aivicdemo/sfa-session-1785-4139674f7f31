import { evaluateProposalRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案妥当性判定", () => {
  // SCEN-1197
  test("営業プロセスリスクスコアが許容範囲内の場合に承認判定される", () => {
    // Arrange: モック化されたAIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        processRiskScore: 0.35,
        relevanceScore: 0.82,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // テスト用の商談データ
    const proposalData = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      budgetAmount: 5000000,
      salesStage: "提案段階",
      proposedContent: "生産効率化システム導入",
      customerConstraints: {
        maxBudget: 10000000,
        requiredDeliveryDate: "2024-06-30",
        acceptableProductCategories: ["システム", "コンサル"],
      },
    };

    // Act: 提案妥当性判定機能を実行
    const result = evaluateProposalRelevance(proposalData, mockAIEngine);

    // Assert: 判定結果を検証
    expect(result.status).toBe("承認");
    expect(result.processRiskScore).toBe(0.35);
    expect(result.relevanceScore).toBe(0.82);
    expect(result.judgmentReason).toContain(
      "営業プロセスリスクスコアが許容範囲（0.0～0.5）内のため、提案を進行可能と判定します"
    );
    expect(result.isApproved).toBe(true);

    // Mock呼び出し確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: "製造業",
        budgetAmount: 5000000,
        salesStage: "提案段階",
      })
    );
  });
});