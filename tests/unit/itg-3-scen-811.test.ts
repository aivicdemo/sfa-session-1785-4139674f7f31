import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨外部連携（失敗時振る舞い）", () => {
  test("SCEN-811: OpenAI API失敗時、内部推奨パターンマスタから統計上位パターンが返却される", async () => {
    // Arrange: 推奨パターンマスタの統計上位パターン
    const recommendationPatternMaster = [
      {
        patternId: "pattern-a",
        patternName: "パターンA",
        successRate: 85,
        occurrenceFrequency: 120,
        description: "過去120件の同類案件で成功した提案アプローチです",
      },
      {
        patternId: "pattern-b",
        patternName: "パターンB",
        successRate: 78,
        occurrenceFrequency: 95,
        description: "過去95件の同類案件で成功した提案アプローチです",
      },
      {
        patternId: "pattern-c",
        patternName: "パターンC",
        successRate: 72,
        occurrenceFrequency: 60,
        description: "過去60件の同類案件で成功した提案アプローチです",
      },
    ];

    // 新規案件データ
    const dealData = {
      customerId: "cust-001",
      customerName: "テスト顧客A",
      industry: "製造業",
      companySize: "medium",
      budget: 5000000,
      dealStage: "初期検討",
      dealAmount: 3000000,
      dealDays: 45,
    };

    // スタブ: OpenAI API失敗を模擬
    const aiRecommendationEngineStub = {
      generateRecommendation: jest
        .fn()
        .mockRejectedValue(new Error("API call failed")),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 推奨生成を実行（API失敗時の振る舞い）
    const result = await generateRecommendationWithFallback(
      dealData,
      aiRecommendationEngineStub,
      recommendationPatternMaster
    );

    // Assert: 内部推奨パターンマスタから統計上位パターン（パターンA）が返却されることを検証
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.recommendedPattern).toEqual({
      patternId: "pattern-a",
      patternName: "パターンA",
      successRate: 85,
      occurrenceFrequency: 120,
      description: "過去120件の同類案件で成功した提案アプローチです",
    });
    expect(result.recommendedPattern.successRate).toBe(85);
    expect(result.recommendedPattern.occurrenceFrequency).toBe(120);
    expect(result.isFallbackMode).toBe(true);

    // Assert: AIエージェント呼び出しが3回（初回1秒、以降2倍の指数バックオフ）を試行したことを確認
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledTimes(
      3
    );
  });
});