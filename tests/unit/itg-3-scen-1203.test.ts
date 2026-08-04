import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1203: 提案妥当性判定機能 - AIエージェント推奨根拠が正常に提供されている場合に妥当性判定に統合される", () => {
    // Arrange: AIRecommendationEngineのスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: "顧客のデジタル化推進ニーズに対し、SaaS型ERPシステムの導入を提案する。実装期間は6ヶ月、ROI期待値は18ヶ月。",
        confidence: 0.85,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "過去3年間の類似顧客(製造業・従業員500-1000名規模)との成功事例から、同様の経営課題を抱える顧客にはSaaS型ERP導入が最適であることを確認。本顧客の業種・規模・予算条件が過去成功案件と合致度95%。実装スケジュールも顧客の事業計画と整合。"
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.78),
    };

    const newDealData = {
      customerId: "CUST-20240115-001",
      customerIndustry: "製造業",
      customerScale: 750,
      dealStage: "初期ヒアリング完了",
      estimatedDealValue: 5000000,
      proposedProduct: "SaaS型ERP",
      customerChallenge: "既存システムの老朽化とデジタル化対応の遅れ",
      dealConditions: {
        budgetLimit: 6000000,
        implementationTimeframe: "6ヶ月以内",
        decisionDeadline: "2024-03-31",
      },
    };

    const integrationTimestamp = new Date("2024-01-15T11:00:00Z");
    jest.useFakeTimers();
    jest.setSystemTime(integrationTimestamp);

    // Act: 提案妥当性判定機能を実行
    const result = evaluateProposalValidity(newDealData, mockAIEngine);

    jest.useRealTimers();

    // Assert: AIRecommendationEngineの3つのメソッドが順序通り呼び出されていることを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    const generateOrder = mockAIEngine.generateRecommendation.mock.invocationCallOrder[0];
    const explainOrder = mockAIEngine.explainRecommendationReasoning.mock.invocationCallOrder[0];
    const evaluateOrder = mockAIEngine.evaluatePatternRelevance.mock.invocationCallOrder[0];
    expect(generateOrder).toBeLessThan(explainOrder);
    expect(explainOrder).toBeLessThan(evaluateOrder);

    // Assert: 妥当性判定結果オブジェクトの属性を検査
    expect(result).toHaveProperty("recommendation");
    expect(result.recommendation).toBe(
      "顧客のデジタル化推進ニーズに対し、SaaS型ERPシステムの導入を提案する。実装期間は6ヶ月、ROI期待値は18ヶ月。"
    );

    expect(result).toHaveProperty("reasoning");
    expect(result.reasoning).toBe(
      "過去3年間の類似顧客(製造業・従業員500-1000名規模)との成功事例から、同様の経営課題を抱える顧客にはSaaS型ERP導入が最適であることを確認。本顧客の業種・規模・予算条件が過去成功案件と合致度95%。実装スケジュールも顧客の事業計画と整合。"
    );

    expect(result).toHaveProperty("relevanceScore");
    expect(typeof result.relevanceScore).toBe("number");
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.relevanceScore).toBe(0.78);

    expect(result).toHaveProperty("isValid");
    expect(typeof result.isValid).toBe("boolean");
    expect(result.isValid).toBe(true);

    expect(result).toHaveProperty("integratedAt");
    expect(result.integratedAt).toBe("2024-01-15T11:00:00Z");
  });
});