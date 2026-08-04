import { evaluateRecommendationRelevanceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2180: [edge] 顧客対応パターンと成功パターンのマッチスコア算出 - 顧客対応パターンが成功パターンと 99.999% マッチするとき、マッチスコアが 100 に丸められる
  test("顧客対応パターンが成功パターンと99.999%マッチするとき、マッチスコアが100に丸められる", () => {
    // Arrange: モック化されたAIRecommendationEngineを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(99.999),
    };

    const customerPattern = {
      customerId: "CUST-001",
      proposalApproach: "consultative_selling",
      interactionSequence: [
        "initial_discovery",
        "needs_analysis",
        "solution_design",
      ],
      decisionMakerEngagement: true,
      followUpTiming: "within_3_days",
    };

    const successPattern = {
      patternId: "SUCCESS-PATTERN-001",
      approachType: "consultative_selling",
      recommendedSequence: [
        "initial_discovery",
        "needs_analysis",
        "solution_design",
        "proposal_presentation",
      ],
      keySuccessFactor: "decision_maker_involvement",
      optimalFollowUpWindow: "within_5_days",
    };

    // Act: マッチスコア算出ロジックを呼び出し
    const matchScore = evaluateRecommendationRelevanceScore(
      customerPattern,
      successPattern,
      mockAIEngine
    );

    // Assert: マッチスコアが100に丸められていることを確認
    expect(matchScore).toBe(100);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerPattern,
      successPattern
    );
  });
});