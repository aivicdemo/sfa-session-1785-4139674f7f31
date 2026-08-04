import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1807
  test("[normal] 推奨内容の根拠説明機能 - 推奨数量の根拠が自然言語で説明文として生成される", async () => {
    // Setup: テスト用スタブデータの定義
    const recommendationId = "REC-20240115-001";
    const customerName = "ABC株式会社";
    const industry = "製造業";
    const budgetAmount = 5000000;
    const businessIssue = "生産効率化";
    const recommendedQuantity = 50;
    const similarCasesCount = 20;
    const efficiencyImprovement = 23;
    const averageImplementedQuantity = 48;

    // Mock AIRecommendationEngine stub data
    const mockRecommendationData = {
      recommendationId,
      customerName,
      industry,
      budgetAmount,
      businessIssue,
      recommendedQuantity,
    };

    // Expected reasoning explanation from explainRecommendationReasoning
    const expectedReasoningExplanation =
      "過去3年間の類似案件20件のうち、同規模・同業種の成功事例では平均48ユニットの導入により生産効率が平均23%向上しました。貴社の予算規模と実装期間を考慮すると、50ユニットの導入が最適です";

    // Mock AIRecommendationEngine interface
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId,
        recommendedQuantity,
        recommendedApproach: "提案アプローチ",
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(expectedReasoningExplanation),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.95),
    };

    // Execute: explainRecommendationReasoning 関数を呼び出し
    const actualReasoningExplanation =
      await explainRecommendationReasoning(
        mockRecommendationData,
        mockAIRecommendationEngine
      );

    // Verify: 期待値との比較
    expect(actualReasoningExplanation).toBe(expectedReasoningExplanation);

    // Verify: 説明文に具体的な数値が含まれていることを確認
    expect(actualReasoningExplanation).toContain(
      String(similarCasesCount) // 20件
    );
    expect(actualReasoningExplanation).toContain(
      String(efficiencyImprovement) // 23%
    );
    expect(actualReasoningExplanation).toContain(
      String(averageImplementedQuantity) // 48ユニット
    );
    expect(actualReasoningExplanation).toContain(
      String(recommendedQuantity) // 50ユニット
    );

    // Verify: 説明文が営業担当者向けの理解しやすい日本語であることを確認
    expect(actualReasoningExplanation).toContain("過去");
    expect(actualReasoningExplanation).toContain("類似案件");
    expect(actualReasoningExplanation).toContain("成功事例");
    expect(actualReasoningExplanation).toContain("生産効率");
    expect(actualReasoningExplanation).toContain("最適");

    // Verify: AIエージェント呼び出しが適切に実行されたことを確認
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(mockRecommendationData);
  });
});