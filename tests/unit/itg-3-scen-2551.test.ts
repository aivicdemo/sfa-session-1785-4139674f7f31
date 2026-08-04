import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2551: 推奨根拠の信頼度スコアが閾値直下のとき、表示される", async () => {
    // Arrange: AIRecommendationEngine のモック化
    const mock_evaluatePatternRelevance_score = 0.59;
    const mock_explain_reasoning_text =
      "過去の類似案件において、製造業500万円規模の提案準備段階で、この提案アプローチが成功した事例が複数確認されています。";

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: {
          proposalApproach:
            "顧客の業務効率化ニーズに基づいた段階的導入アプローチ",
          recommendedTiming: "提案準備段階での詳細ヒアリング",
          actionItems: [
            "現状業務フローの詳細ヒアリング",
            "改善効果の定量化",
            "導入スケジュール提案",
          ],
        },
        trustScore: mock_evaluatePatternRelevance_score,
        reasoning: mock_explain_reasoning_text,
      }),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue(mock_evaluatePatternRelevance_score),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(mock_explain_reasoning_text),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const test_input = {
      customerIndustry: "製造業",
      dealSize: 5000000,
      dealStage: "提案準備中",
      aiRecommendationEngine: mockAIEngine,
    };

    // Act: generateRecommendation を呼び出し
    const result = await generateRecommendation(test_input);

    // Assert: 推奨内容が返される
    expect(result).toBeDefined();
    expect(result.recommendationContent).toBeDefined();
    expect(result.recommendationContent.proposalApproach).toBe(
      "顧客の業務効率化ニーズに基づいた段階的導入アプローチ"
    );

    // Assert: 信頼度スコアが 0.59 で表示される
    expect(result.trustScore).toBe(0.59);

    // Assert: スコアが閾値 0.60 直下であることを確認
    expect(result.trustScore).toBeLessThan(0.6);
    expect(result.trustScore).toBeGreaterThanOrEqual(0.59);

    // Assert: 根拠説明文が返される
    expect(result.reasoning).toBe(mock_explain_reasoning_text);
    expect(result.reasoning).toContain("製造業");
    expect(result.reasoning).toContain("500万円");

    // Assert: 可視化に必要なデータが全て揃っていることを確認
    expect(result).toEqual({
      recommendationContent: {
        proposalApproach:
          "顧客の業務効率化ニーズに基づいた段階的導入アプローチ",
        recommendedTiming: "提案準備段階での詳細ヒアリング",
        actionItems: [
          "現状業務フローの詳細ヒアリング",
          "改善効果の定量化",
          "導入スケジュール提案",
        ],
      },
      trustScore: 0.59,
      reasoning: mock_explain_reasoning_text,
    });

    // Assert: AI エンジンのメソッドが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      test_input
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});