import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-878: 推奨信頼度スコア算出機能 - 推奨生成日と提示日が同日のとき信頼度スコアが減衰しない", () => {
    // 推奨生成日時を現在時刻（同日のケース）に設定
    const recommendation_generation_datetime = new Date("2026-08-01T10:00:00Z");
    
    // 推奨提示日時を同じ日時に設定（時間差0日）
    const recommendation_presentation_datetime = new Date("2026-08-01T10:00:00Z");
    
    // 推奨生成時点での初期信頼度スコア
    const initial_confidence_score = 0.95;
    
    // スタブAIRecommendationEngineを設定
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "rec_001",
        recommendation_content: "提案アプローチA",
        recommendation_generation_datetime: recommendation_generation_datetime,
        initial_confidence_score: initial_confidence_score,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
    
    // 信頼度スコア減衰計算ロジックを実行
    const calculated_confidence_score = calculateRecommendationConfidenceScore(
      recommendation_generation_datetime,
      recommendation_presentation_datetime,
      initial_confidence_score,
      aiRecommendationEngineStub
    );
    
    // 期待結果: 推奨生成日と提示日が同日のとき、信頼度スコアが初期値から減衰しない
    expect(calculated_confidence_score).toBe(0.95);
  });
});