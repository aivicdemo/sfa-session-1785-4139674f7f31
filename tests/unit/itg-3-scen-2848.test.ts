import { evaluateRecommendationCorrelation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2848
  test("推奨内容の成約実績相関判定機能 - 成功パターンの提案アプローチが実際の成約実績と高い相関を示した場合、判定結果が承認可と決定される", () => {
    const correlationScore = 0.89;
    const actualConversionRate = 0.78;
    const overallAverageConversionRate = 0.52;
    const correlationThreshold = 0.75;
    const performanceDelta = actualConversionRate - overallAverageConversionRate;

    const input = {
      correlationScore: correlationScore,
      actualConversionRate: actualConversionRate,
      overallAverageConversionRate: overallAverageConversionRate,
      correlationThreshold: correlationThreshold,
    };

    const result = evaluateRecommendationCorrelation(input);

    expect(result.status).toBe("APPROVED");
    expect(result.correlationScore).toBe(0.89);
    expect(result.actualConversionRate).toBe(0.78);
    expect(result.performanceDelta).toBe(0.26);
    expect(result.reasoning).toContain("相関度スコア0.89は基準値0.75以上を満たし");
    expect(result.reasoning).toContain("実績成約率78%は全体平均52%を大きく上回る");
  });
});