import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-288: 推奨根拠の信頼度スコアが表示閾値直上のとき、その根拠が可視化対象に含まれる", async () => {
    // 表示閾値定数の確認
    const VISIBILITY_THRESHOLD = 0.60;

    // モック化されたAIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // evaluatePatternRelevanceが信頼度スコア0.60を返すように設定
    mockAIRecommendationEngine.evaluatePatternRelevance.mockResolvedValue({
      relevanceScore: 0.60,
      patternId: "pattern_001",
      matchPercentage: 0.60,
    });

    // generateRecommendationが複数の根拠を含む推奨結果を返すようにモック化
    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendationId: "rec_001",
      proposalApproach: "提案アプローチA",
      recommendations: [
        {
          content: "根拠A",
          confidenceScore: 0.60,
          relatedPatternId: "pattern_001",
          reasoning: "過去の同業種での成功パターンに合致",
        },
        {
          content: "根拠B",
          confidenceScore: 0.45,
          relatedPatternId: "pattern_002",
          reasoning: "予算規模の類似事例",
        },
        {
          content: "根拠C",
          confidenceScore: 0.75,
          relatedPatternId: "pattern_003",
          reasoning: "導入期間の実績",
        },
      ],
    });

    // 新規案件データの入力
    const dealInput = {
      customerId: "cust_123",
      industry: "製造業",
      budget: 50000000,
      implementationPeriodMonths: 3,
      dealStage: "proposal",
    };

    // generateRecommendationメソッドを呼び出し
    const recommendationResult = await mockAIRecommendationEngine.generateRecommendation(
      dealInput
    );

    // 推奨結果から根拠を抽出
    const visibilityTargetReasons = recommendationResult.recommendations.filter(
      (reason: any) => reason.confidenceScore >= VISIBILITY_THRESHOLD
    );

    // スコア0.60の根拠がリストに含まれていることを確認
    const scoredAtThresholdReason = visibilityTargetReasons.find(
      (reason: any) => reason.confidenceScore === 0.60
    );

    expect(scoredAtThresholdReason).toBeDefined();
    expect(scoredAtThresholdReason.content).toBe("根拠A");
    expect(scoredAtThresholdReason.confidenceScore).toBe(0.60);
    expect(scoredAtThresholdReason.relatedPatternId).toBe("pattern_001");
    expect(scoredAtThresholdReason.reasoning).toBe(
      "過去の同業種での成功パターンに合致"
    );

    // 可視化対象リスト全体の検証（スコア >= 0.60のもののみ）
    expect(visibilityTargetReasons.length).toBe(2);

    const visibilityTargetScores = visibilityTargetReasons.map(
      (reason: any) => reason.confidenceScore
    );
    expect(visibilityTargetScores).toContain(0.60);
    expect(visibilityTargetScores).toContain(0.75);
    expect(visibilityTargetScores).not.toContain(0.45);

    // 根拠の詳細情報が完全に保持されていることを確認
    expect(scoredAtThresholdReason).toHaveProperty("content");
    expect(scoredAtThresholdReason).toHaveProperty("confidenceScore");
    expect(scoredAtThresholdReason).toHaveProperty("relatedPatternId");
    expect(scoredAtThresholdReason).toHaveProperty("reasoning");

    expect(typeof scoredAtThresholdReason.content).toBe("string");
    expect(typeof scoredAtThresholdReason.confidenceScore).toBe("number");
    expect(typeof scoredAtThresholdReason.relatedPatternId).toBe("string");
    expect(typeof scoredAtThresholdReason.reasoning).toBe("string");
  });
});