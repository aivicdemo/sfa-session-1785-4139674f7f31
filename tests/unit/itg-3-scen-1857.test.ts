import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1857
  test("explainRecommendationReasoning がタイムアウトしたとき指数バックオフ再試行を実行し、すべて失敗後に推奨パターンマスタから簡略版根拠を代替生成する", async () => {
    const recommendation_id = "REC-20250801-001";
    const timeout_duration_seconds = 30;
    const backoff_retry_count = 3;
    const backoff_intervals_seconds = [1, 2, 4];
    const total_backoff_duration_seconds = backoff_intervals_seconds.reduce(
      (a, b) => a + b,
      0
    );
    const expected_pattern_success_rate = 78;
    const expected_reasoning_type = "simplified";
    const expected_explanation =
      '過去の同業他社事例では、提案アプローチ「課題ヒアリング重視型」が成功率78%で最高成績です';

    const ai_engine_stub = {
      explainRecommendationReasoning: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(
            () => {
              reject(new Error("Timeout: API call exceeded 30 seconds"));
            },
            timeout_duration_seconds * 1000
          );
        });
      }),
    };

    const pattern_master_stub = {
      getTopSuccessPatternsForRecommendation: jest
        .fn()
        .mockReturnValue([
          {
            pattern_id: "PAT-001",
            approach_name: "課題ヒアリング重視型",
            success_rate: expected_pattern_success_rate,
            industry: "同業他社",
            total_deals: 45,
            successful_deals: 35,
          },
        ]),
    };

    const result = await explainRecommendationReasoning(
      recommendation_id,
      ai_engine_stub,
      pattern_master_stub,
      timeout_duration_seconds
    );

    expect(result).toEqual({
      reasoningType: expected_reasoning_type,
      patternSuccessRate: expected_pattern_success_rate,
      explanation: expected_explanation,
    });

    expect(ai_engine_stub.explainRecommendationReasoning).toHaveBeenCalledTimes(
      backoff_retry_count + 1
    );

    expect(
      pattern_master_stub.getTopSuccessPatternsForRecommendation
    ).toHaveBeenCalledWith(recommendation_id);
  });
});