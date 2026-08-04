import { explainRecommendationReasoningWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1929
  test("AIエージェントタイムアウト時に簡略版根拠説明が返却される", async () => {
    // AIRecommendationEngineのexplainRecommendationReasoningメソッドをモック化
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("Request timeout after 30000ms"));
            }, 31000);
          })
      ),
    };

    // 推奨根拠の可視化機能を呼び出し
    const recommendationId = "rec_12345";
    const customerId = "cust_67890";

    const result = await explainRecommendationReasoningWithFallback(
      recommendationId,
      customerId,
      mockAIEngine
    );

    // タイムアウト発生時の処理フローに入ることを確認
    expect(result).toBeDefined();
    expect(result).toHaveProperty("reasoning_text");
    expect(result).toHaveProperty("pattern_source");
    expect(result).toHaveProperty("is_fallback");

    // 根拠説明生成ロジックが簡略版フォーマット（パターンマスタ由来の基本説明）を生成していることをアサート
    expect(result.pattern_source).toBe("recommendation_pattern_master");
    expect(result.is_fallback).toBe(true);

    // 返却されたレスポンスオブジェクトに、簡略版の根拠説明が含まれていることを検証
    expect(typeof result.reasoning_text).toBe("string");
    expect(result.reasoning_text.length).toBeGreaterThan(0);

    // 簡略版根拠説明に、過去成功パターンの統計情報が含まれていることを確認
    expect(result.reasoning_text).toMatch(/成功率|類似案件|パターン/);
    expect(result).toHaveProperty("success_rate");
    expect(typeof result.success_rate).toBe("number");
    expect(result.success_rate).toBeGreaterThanOrEqual(0);
    expect(result.success_rate).toBeLessThanOrEqual(100);

    // AIタイムアウト時のログに、「代替動作：簡略版根拠を返却」というイベント記録が存在することを検証
    expect(result).toHaveProperty("fallback_event_log");
    expect(Array.isArray(result.fallback_event_log)).toBe(true);
    expect(result.fallback_event_log.length).toBeGreaterThan(0);
    expect(result.fallback_event_log[0]).toMatch(/簡略版|代替|フォールバック/);

    // 具体的な統計値が含まれていることを確認
    expect(result).toHaveProperty("similar_cases_count");
    expect(typeof result.similar_cases_count).toBe("number");
    expect(result.similar_cases_count).toBeGreaterThanOrEqual(0);

    expect(result).toHaveProperty("pattern_rank");
    expect(typeof result.pattern_rank).toBe("number");
    expect(result.pattern_rank).toBeGreaterThan(0);

    // 簡略版根拠説明に統計的に上位の成功パターン情報が含まれているか検証
    expect(result.reasoning_text).toContain(
      `過去${result.similar_cases_count}件の類似案件`
    );
    expect(result.reasoning_text).toContain(`成功率${result.success_rate}%`);
    expect(result.reasoning_text).toContain(`上位${result.pattern_rank}番目`);

    // レスポンスが内部推奨パターンマスタから抽出されたデータを含んでいることを確認
    expect(result).toHaveProperty("pattern_id");
    expect(typeof result.pattern_id).toBe("string");
    expect(result.pattern_id).toMatch(/^pattern_/);
  });
});