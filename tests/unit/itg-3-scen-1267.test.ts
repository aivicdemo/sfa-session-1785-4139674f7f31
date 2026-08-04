import { evaluateProposalViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1267
  test("提案妥当性判定機能 - 顧客ニーズも営業プロセスも両方満たさない場合に却下判定が出力される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "高額プレミアム機能パッケージ",
        salesProcessCompatibilityScore: 0.4,
        confidence: 0.35,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        customerNeedsCompatibilityScore: 0.3,
        applicability: false,
      }),
    };

    const inputParams = {
      customerChallenge: "コスト削減",
      salesStage: "初期ヒアリング",
      recommendedProposalContent: "高額プレミアム機能パッケージ",
    };

    const result = evaluateProposalViability(
      inputParams,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    expect(result.judgement).toBe("Rejected");
    expect(result.reasonDetail).toContain("顧客ニーズ適合度: 0.3");
    expect(result.reasonDetail).toContain("営業プロセス適合度: 0.4");
    expect(result.reasonDetail).toContain("いずれも閾値0.5以下のため推奨不可");
  });
});