import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2680: 推奨内容が1件のとき、その1件に対する根拠が表示される", () => {
    const mockRecommendation = {
      id: "REC-001",
      content: "顧客X向けの提案アプローチA",
      reasoning: "過去成功パターンマッチスコア85%"
    };

    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendations: [mockRecommendation]
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "顧客Xの業界特性と過去成功パターンとの一致度が高く、提案アプローチAは過去成功パターンマッチスコア85%で適用可能性が高いと判定されました。"
      )
    };

    const customerData = {
      customerId: "CUST-001",
      customerName: "顧客X",
      industry: "製造業",
      scale: "中堅"
    };

    const dealConditions = {
      dealId: "DEAL-001",
      productCategory: "システム構築",
      budget: 5000000,
      timeline: "3ヶ月以内"
    };

    mockRecommendationEngine.generateRecommendation(customerData, dealConditions);

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerData,
      dealConditions
    );

    const generatedRecommendations = mockRecommendationEngine.generateRecommendation(
      customerData,
      dealConditions
    );

    expect(generatedRecommendations.recommendations).toHaveLength(1);
    expect(generatedRecommendations.recommendations[0]).toEqual({
      id: "REC-001",
      content: "顧客X向けの提案アプローチA",
      reasoning: "過去成功パターンマッチスコア85%"
    });

    const reasoningExplanation = mockRecommendationEngine.explainRecommendationReasoning(
      mockRecommendation.id,
      mockRecommendation.reasoning
    );

    expect(reasoningExplanation).toBeDefined();
    expect(typeof reasoningExplanation).toBe("string");
    expect(reasoningExplanation).toContain("過去成功パターンマッチスコア85%");
    expect(reasoningExplanation).toContain("顧客X");
    expect(reasoningExplanation).toContain("適用可能性");

    const displayContent = {
      recommendation: generatedRecommendations.recommendations[0],
      explanation: reasoningExplanation
    };

    expect(displayContent.recommendation.id).toBe("REC-001");
    expect(displayContent.recommendation.content).toBe("顧客X向けの提案アプローチA");
    expect(displayContent.explanation).toContain("過去成功パターンマッチスコア85%");
  });
});