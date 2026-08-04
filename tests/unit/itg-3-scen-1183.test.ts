import { evaluateProposalViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨支援システム - 提案妥当性判定機能", () => {
  // SCEN-1183: [normal] 提案内容から0件の改善指摘が生成される
  test("提案妥当性判定が改善指摘0件で返却される場合、改善指摘セクションに0件と表示される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposedApproach: "顧客のコア課題に対する統合ソリューション提案",
        confidenceScore: 92,
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        viabilityScore: 85,
        improvementPoints: [],
        rationale:
          "現在の提案内容は過去の成功パターンに完全に適合しており、追加の改善は不要です",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const inputProposal = {
      customerInfo: {
        companyScale: "large",
        industry: "manufacturing",
        purchaseBudget: 5000000,
      },
      dealConditions: {
        proposalContent: "AI導入による業務効率化ソリューション",
        salesApproach: "consultative",
        competitiveStatus: "competitive",
      },
    };

    const result = evaluateProposalViability(
      inputProposal,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    expect(result.viabilityScore).toBe(85);
    expect(result.improvementPointCount).toBe(0);
    expect(result.improvementPoints).toEqual([]);
    expect(result.rationale).toBe(
      "現在の提案内容は過去の成功パターンに完全に適合しており、追加の改善は不要です"
    );
    expect(result.displayText).toBe("改善指摘: 0件");
    expect(result.isHighEvaluation).toBe(true);
  });
});