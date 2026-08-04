import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1184: 提案妥当性判定機能 - 提案内容から1件の改善指摘が生成される", () => {
    // テスト用スタブ: AIRecommendationEngine
    const stubAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // スタブの応答を設定：1件の改善指摘を含むレスポンス
    const improvementInsight = {
      id: "insight_001",
      category: "approach_alignment",
      message:
        "提案アプローチが顧客の経営課題（生産性向上）に対応していない可能性があります。製造業向けの成功パターンでは、ROI測定指標を提案に含めることが契約率向上に寄与しています",
      severity: "medium",
      recommendedAction: "ROI測定指標を提案内容に追加",
      basedOnSuccessPatterns: [
        {
          patternId: "pat_manufacturing_001",
          successRate: 0.78,
          customerIndustry: "製造業",
          keyMetric: "ROI測定指標",
        },
      ],
    };

    stubAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      status: "success",
      improvementInsights: [improvementInsight],
      totalInsightCount: 1,
      recommendationId: "rec_20240115_001",
      timestamp: "2024-01-15T11:00:00Z",
    });

    // テスト入力データ
    const proposalInput = {
      customerIndustry: "製造業",
      dealStage: "提案前ヒアリング完了",
      proposalApproach: "コスト削減重視",
      customerId: "cust_12345",
      dealId: "deal_67890",
    };

    // 期待値の計算
    const expectedTotalInsightCount = 1;
    const expectedInsightMessage =
      "提案アプローチが顧客の経営課題（生産性向上）に対応していない可能性があります。製造業向けの成功パターンでは、ROI測定指標を提案に含めることが契約率向上に寄与しています";
    const expectedSuccessRate = 0.78;

    // テスト実行
    const result = evaluateProposalFeasibility(proposalInput, {
      aiRecommendationEngine: stubAIRecommendationEngine,
    });

    // Assertion 1: AIRecommendationEngineのgenerateRecommendationメソッドが呼び出されたことを確認
    expect(
      stubAIRecommendationEngine.generateRecommendation
    ).toHaveBeenCalled();

    // Assertion 2: 改善指摘の件数が正確に1件であることを検証
    expect(result.improvementInsights.length).toBe(expectedTotalInsightCount);

    // Assertion 3: 改善指摘の内容が期待値と一致することを検証
    expect(result.improvementInsights[0].message).toBe(expectedInsightMessage);

    // Assertion 4: 改善指摘のセクションに複数件が表示されていないことを確認
    expect(result.improvementInsights).toHaveLength(1);

    // Assertion 5: 根拠となった成功パターンの成功率が正確な値であることを検証
    expect(
      result.improvementInsights[0].basedOnSuccessPatterns[0].successRate
    ).toBe(expectedSuccessRate);

    // Assertion 6: 推奨アクションが存在することを確認
    expect(result.improvementInsights[0].recommendedAction).toBe(
      "ROI測定指標を提案内容に追加"
    );

    // Assertion 7: レコメンデーションIDが返されていることを確認
    expect(result.recommendationId).toBe("rec_20240115_001");

    // Assertion 8: タイムスタンプが固定値で設定されていることを確認
    expect(result.timestamp).toBe("2024-01-15T11:00:00Z");

    // Assertion 9: ステータスが成功であることを確認
    expect(result.status).toBe("success");
  });
});