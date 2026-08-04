import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-058
  test("推奨根拠説明生成機能 - OpenAI API呼び出しが成功した場合に根拠説明が正常に返される", async () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        status: "success",
        reasoning: {
          similarPatternCount: 28,
          totalPatternCount: 32,
          applicabilityScore: 0.88,
          explanation: "過去3年間の類似案件32件中28件で成功している提案アプローチです。顧客業種が製造業で、予算規模が5,000万円～1億円のセグメントにおいて、段階的な導入とトレーニング支援を組み合わせた提案が高い採用率を示しています。本案件は同一セグメントに属し、営業担当者の対応レベルも標準以上であるため、このパターンの適用が推奨されます。",
          recommendedActions: [
            "初期ヒアリングで経営課題を明確化",
            "導入スケジュールを3ヶ月で提案",
            "トレーニング計画を事前に準備"
          ],
          riskFactors: ["競合他社との比較検討中", "予算承認待機中"]
        },
        transactionStatus: "completed",
        errorMessage: null
      })
    };

    const recommendationInput = {
      recommendationId: "rec-12345",
      customerName: "株式会社ABC製造所",
      businessCategory: "製造業",
      productCategory: "生産管理システム",
      budgetRange: {
        min: 5000,
        max: 10000
      },
      budgetUnit: "万円",
      dealStage: "提案検討中",
      salesRepExperience: "3年以上"
    };

    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );

    expect(result.status).toBe("success");
    expect(result.errorMessage).toBeNull();
    expect(result.transactionStatus).toBe("completed");

    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.explanation).toContain("過去3年間の類似案件32件中28件で成功している提案アプローチ");
    expect(typeof result.reasoning.explanation).toBe("string");
    expect(result.reasoning.explanation.length).toBeGreaterThan(0);

    expect(result.reasoning.applicabilityScore).toBe(0.88);
    expect(typeof result.reasoning.applicabilityScore).toBe("number");
    expect(result.reasoning.applicabilityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.reasoning.applicabilityScore).toBeLessThanOrEqual(1.0);

    expect(result.reasoning.similarPatternCount).toBe(28);
    expect(result.reasoning.totalPatternCount).toBe(32);
    expect(typeof result.reasoning.similarPatternCount).toBe("number");
    expect(typeof result.reasoning.totalPatternCount).toBe("number");

    expect(Array.isArray(result.reasoning.recommendedActions)).toBe(true);
    expect(result.reasoning.recommendedActions.length).toBeGreaterThan(0);
    expect(result.reasoning.recommendedActions[0]).toContain("ヒアリング");

    expect(Array.isArray(result.reasoning.riskFactors)).toBe(true);
    expect(result.reasoning.riskFactors.length).toBeGreaterThan(0);
  });
});