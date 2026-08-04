import { evaluateRecommendationViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1637
  test("[normal] 推奨妥当性スコア算出機能 - 提案内容が顧客制約条件の金額上限直下の場合、スコアが正しく算出される", () => {
    // Arrange: 顧客制約条件を設定
    const customerConstraint = {
      customerId: "CUST-001",
      maxBudget: 1000000,
      budgetCurrency: "JPY",
      allowedProductCategories: ["SOFT001", "SOFT002"],
      maxPurchaseFrequency: "monthly",
      contractDurationMonths: 12,
    };

    // 提案内容を設定（金額上限直下）
    const proposalContent = {
      proposalId: "PROP-001",
      customerId: "CUST-001",
      totalAmount: 999999,
      currency: "JPY",
      productCategories: ["SOFT001"],
      proposedDurationMonths: 12,
      implementationTimeline: "2024-02-15",
    };

    // AIRecommendationEngineのスタブを作成
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.95,
        applicability: true,
        matchedPatternIds: ["PATTERN-001"],
      }),
    };

    // Act: 推奨妥当性スコア算出関数を実行
    const result = evaluateRecommendationViability(
      customerConstraint,
      proposalContent,
      aiRecommendationEngineStub
    );

    // Assert: スコア値と計算パラメータを検証
    expect(result.viabilityScore).toBeGreaterThanOrEqual(95);
    expect(result.viabilityScore).toBeLessThanOrEqual(100);

    // 金額乖離率の検証：(上限金額 - 提案金額) / 上限金額
    const expectedAmountDeviation = (1000000 - 999999) / 1000000; // 0.000001
    const expectedAmountCompatibility = 1 - expectedAmountDeviation; // 0.999999 ≈ 99.9999%
    expect(result.amountCompatibility).toBeCloseTo(
      expectedAmountCompatibility,
      4
    );

    // パラメータ情報の検証
    expect(result.evaluationParameters).toEqual({
      proposalAmount: 999999,
      budgetLimit: 1000000,
      amountDeviationRate: expectedAmountDeviation,
      categoryMatch: true,
      durationMatch: true,
      frequencyMatch: true,
    });

    // 戻り値の精度検証（小数点第2位までの数値）
    const scoreDecimalPlaces = (result.viabilityScore.toString().split(".")[1] ||
      "").length;
    expect(scoreDecimalPlaces).toBeLessThanOrEqual(2);

    // AIエージェントが正しく呼び出されたことを確認
    expect(
      aiRecommendationEngineStub.evaluatePatternRelevance
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST-001",
        proposalId: "PROP-001",
      })
    );
  });
});