import {
  calculateRecommendationConfidenceScore,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2458: [edge] 推奨精度スコア算出機能 - 営業管理職がスコア値を参照したとき推奨内容の信頼性判断が可能である
  test("営業管理職が推奨精度スコアと信頼度情報から推奨内容の信頼性判断が可能である", () => {
    // Arrange: AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // スタブの応答データ設定
    const stubRecommendationData = {
      recommendationScore: 0.92,
      confidenceLevel: "高",
      similarityScore: 0.88,
      applicabilityScore: 0.95,
      similarCasesCount: 5,
      averageSuccessRate: 0.93,
      matchPercentage: 89,
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(stubRecommendationData);

    // 新規案件データ定義
    const newProjectInput = {
      customerIndustry: "製造業",
      budgetScale: 5000000,
      implementationPeriod: "3ヶ月以内",
      userId: "manager_001",
      userRole: "営業管理職",
    };

    // Act: 推奨精度スコア算出機能を実行
    const result = calculateRecommendationConfidenceScore(
      newProjectInput,
      mockAIEngine
    );

    // Assert: 期待結果の検証
    // ①総合スコア0.92を数値で表示
    expect(result.totalScore).toBe(0.92);

    // ②信頼度レベル『高』をステータスラベルで表示
    expect(result.confidenceLevel).toBe("高");

    // ③類似度スコア0.88と適用可能性スコア0.95が信頼性判断の根拠として明記
    expect(result.similarityScore).toBe(0.88);
    expect(result.applicabilityScore).toBe(0.95);

    // ④スコア値の算出根拠が営業管理職向けの自然言語で表示
    expect(result.reasoningExplanation).toContain("類似案件");
    expect(result.reasoningExplanation).toContain("5件");
    expect(result.reasoningExplanation).toContain("93%");
    expect(result.reasoningExplanation).toContain("89%");

    // ⑤類似事例数が明記されていることを確認
    expect(result.similarCasesCount).toBe(5);

    // ⑥全体構造が営業管理職の信頼性判断に必要な情報要素を含むこと
    expect(result).toHaveProperty("totalScore");
    expect(result).toHaveProperty("confidenceLevel");
    expect(result).toHaveProperty("similarityScore");
    expect(result).toHaveProperty("applicabilityScore");
    expect(result).toHaveProperty("similarCasesCount");
    expect(result).toHaveProperty("reasoningExplanation");

    // ⑦スコア値が0～100の範囲内であること（正規化確認）
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(1);
    expect(result.similarityScore).toBeGreaterThanOrEqual(0);
    expect(result.similarityScore).toBeLessThanOrEqual(1);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(1);
  });
});