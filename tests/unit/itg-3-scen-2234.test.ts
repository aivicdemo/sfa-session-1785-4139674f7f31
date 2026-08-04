import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2234: [normal] 推奨根拠説明生成機能 - 推奨内容の根拠が営業担当者向けに自然言語で説明される", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      recommendationId: "REC-2024-001",
      customerId: "CUST-2024-0001",
      customerName: "テスト太郎",
      industry: "製造業",
      budgetAmount: 6000000,
      dealStage: "提案前",
      recommendedPlan: "エンタープライズ向けプランA",
      similarityScore: 0.85,
      successCaseCount: 3,
      successRateByIndustry: 0.82,
      averageSuccessRateBySimilarBudget: 0.75,
    };

    const expectedExplanationStructure = {
      matchingReason:
        "貴社顧客の予算規模600万円は、同規模案件の成約率が平均75%の過去事例と一致しています",
      applicabilityBasis: "同業種での提案成功率：82%",
      recommendationContext:
        "顧客の予算規模（500万円以上）と業界（製造業）が過去成功事例と合致しているため、エンタープライズ向けプランAの提案を推奨します",
    };

    mockAIEngine.explainRecommendationReasoning.mockResolvedValueOnce({
      explanationText:
        "貴社顧客の予算規模600万円は、同規模案件の成約率が平均75%の過去事例と一致しています。同業種での提案成功率は82%であり、類似度スコア0.85以上の過去成功事例3件から適用可能性が高いと判断されています。顧客の予算規模（500万円以上）と業界（製造業）が過去成功事例と合致しているため、エンタープライズ向けプランAの提案を推奨します。",
      sentenceCount: 4,
      isBusinessContextual: true,
      estimatedCompletionTime: 1500,
    });

    const result = await explainRecommendationReasoning(
      recommendationData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.explanationText).toBeTruthy();
    expect(typeof result.explanationText).toBe("string");

    const explanationText = result.explanationText;
    expect(explanationText).toContain("600万円");
    expect(explanationText).toContain("75%");
    expect(explanationText).toContain("82%");
    expect(explanationText).toContain("エンタープライズ向けプランA");
    expect(explanationText).toContain("製造業");

    const sentenceArray = explanationText
      .split(/[。！？]/)
      .filter((s) => s.trim().length > 0);
    expect(sentenceArray.length).toBeGreaterThanOrEqual(3);
    expect(sentenceArray.length).toBeLessThanOrEqual(5);

    expect(result.sentenceCount).toBe(4);
    expect(result.isBusinessContextual).toBe(true);

    expect(result.estimatedCompletionTime).toBeLessThanOrEqual(30000);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: "REC-2024-001",
        customerId: "CUST-2024-0001",
        customerName: "テスト太郎",
        industry: "製造業",
        budgetAmount: 6000000,
      })
    );

    expect(explanationText).not.toMatch(/api|token|embedding/i);
    expect(explanationText).not.toMatch(/0\.[0-9]{6,}/);
  });
});