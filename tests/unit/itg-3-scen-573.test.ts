import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("推奨根拠説明文生成機能", () => {
  // SCEN-573
  test("推奨提案が1個のとき1つの根拠説明文が生成される", () => {
    // Arrange
    const recommendationId = "rec-001";
    const recommendationContent = "新規営業フォローアップを実施";
    const successPatternId = "sp-042";

    const singleRecommendation = {
      recommendationId: recommendationId,
      content: recommendationContent,
      relatedSuccessPatternId: successPatternId,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(() => singleRecommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(
        (recId: string) =>
          "過去の類似案件において、営業フォローアップを3週間以内に実施した案件の成約率は82%でした。本顧客の購買シグナルと商談段階が過去成功パターン（パターンID: sp-042）と合致しているため、現在のタイミングでのフォローアップが最適と判断されます。顧客の経営課題と提案内容の適合度も95%で高く、実装による投資対効果が期待できます。"
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act
    const explanations = explainRecommendationReasoning(
      [singleRecommendation],
      mockAIEngine
    );

    // Assert
    expect(explanations).toHaveLength(1);
    expect(explanations[0]).toBeDefined();
    expect(typeof explanations[0]).toBe("string");
    expect(explanations[0].length).toBeGreaterThanOrEqual(20);
    expect(explanations[0]).toContain("過去");
    expect(explanations[0]).toContain("成功");
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});