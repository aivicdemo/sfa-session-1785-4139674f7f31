import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1539
  test("推奨内容の根拠が自然言語説明文として生成される", async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          "当案件は過去12ヶ月の成功事例と類似度92%で合致します。特に同業種・同規模の顧客3社での導入事例から、段階的な導入アプローチが有効と判断されています。提案では初期段階で既存システムとの連携機能を優先し、3ヶ月後の効果測定フェーズに移行することを推奨します。",
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationInput = {
      customerId: "CUST-001",
      dealAmount: "500万円",
      industry: "製造業",
      issue: "生産効率化",
    };

    const result = await explainRecommendationReasoning(
      recommendationInput,
      mockAIRecommendationEngine
    );

    expect(result.explanation).toBe(
      "当案件は過去12ヶ月の成功事例と類似度92%で合致します。特に同業種・同規模の顧客3社での導入事例から、段階的な導入アプローチが有効と判断されています。提案では初期段階で既存システムとの連携機能を優先し、3ヶ月後の効果測定フェーズに移行することを推奨します。"
    );
    expect(result.explanation).toContain("類似度92%");
    expect(result.explanation).toContain("顧客3社");
    expect(result.explanation).toContain("段階的な導入アプローチ");
    expect(result.explanation).toContain("3ヶ月後の効果測定フェーズ");
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );
  });
});