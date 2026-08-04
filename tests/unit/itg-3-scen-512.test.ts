import { DataQualityValidator } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質スコアと改善優先度ランクの整合性検証", () => {
  test("SCEN-512: データ品質スコアが100に近いのに改善優先度ランクが1のとき、整合性エラーが発生する", () => {
    // テストデータ: スコア 95（100 に近い）と改善優先度ランク 1（最高優先度）の矛盾
    const inconsistentRecommendationData = {
      dataQualityScore: 95,
      improvementPriorityRank: 1,
      recommendationId: "rec-test-001",
      customerId: "cust-001",
      dealId: "deal-001",
      generatedAt: new Date("2024-01-15T11:00:00Z"),
    };

    // AIRecommendationEngine のスタブ（正常系応答）
    const stubAIRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue({
          recommendationType: "APPROACH",
          confidenceScore: 85,
          suggestedAction: "Follow-up call",
        }),
      findSimilarPatterns: jest
        .fn()
        .mockResolvedValue([
          {
            patternId: "pattern-001",
            matchScore: 92,
          },
        ]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue({
          reasoningText: "Based on similar customer patterns...",
        }),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue({
          relevanceScore: 88,
        }),
    };

    // DataQualityValidator のインスタンスを作成し、validateScoreAndPriorityConsistency を呼び出す
    const validator = new DataQualityValidator(stubAIRecommendationEngine);

    // validateScoreAndPriorityConsistency メソッドの実行時にエラーが throw される
    expect(() => {
      validator.validateScoreAndPriorityConsistency(
        inconsistentRecommendationData
      );
    }).toThrow(/データ品質スコア 95 は改善優先度ランク 1 と整合しません/);

    // スローされたエラーの詳細を検証
    try {
      validator.validateScoreAndPriorityConsistency(
        inconsistentRecommendationData
      );
    } catch (error) {
      // エラーメッセージの内容確認
      expect(error).toHaveProperty("message");
      expect(error.message).toContain("スコア 95 に対応する改善優先度ランクは 3 以上");

      // エラーコードの確認
      expect(error).toHaveProperty("errorCode");
      expect(error.errorCode).toBe("INCONSISTENT_QUALITY_PRIORITY");
    }
  });
});