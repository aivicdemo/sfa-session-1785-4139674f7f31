import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨精度スコア算出", () => {
  // SCEN-2454
  test("複数の信頼度要因の加重平均が端数で出るとき、小数第2位で四捨五入される", () => {
    const confidenceFactors = [
      {
        factorName: "顧客属性マッチ度",
        score: 0.87,
        weight: 0.4,
      },
      {
        factorName: "商談段階適合度",
        score: 0.93,
        weight: 0.35,
      },
      {
        factorName: "過去成功パターン合致度",
        score: 0.79,
        weight: 0.25,
      },
    ];

    const result = calculateRecommendationConfidenceScore(confidenceFactors);

    // 加重平均: (0.87 * 0.4 + 0.93 * 0.35 + 0.79 * 0.25) = 0.8768
    // 小数第2位で四捨五入: 0.88
    expect(result.confidenceScore).toBe(0.88);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);
  });

  test("加重平均0.5555の場合、小数第2位で四捨五入されて0.56になる", () => {
    const confidenceFactors = [
      {
        factorName: "要因A",
        score: 0.5,
        weight: 0.5,
      },
      {
        factorName: "要因B",
        score: 0.61,
        weight: 0.5,
      },
    ];

    const result = calculateRecommendationConfidenceScore(confidenceFactors);

    // 加重平均: (0.5 * 0.5 + 0.61 * 0.5) = 0.555
    // 小数第2位で四捨五入: 0.56
    expect(result.confidenceScore).toBe(0.56);
  });

  test("加重平均0.3333の場合、小数第2位で四捨五入されて0.33になる", () => {
    const confidenceFactors = [
      {
        factorName: "要因A",
        score: 0.33,
        weight: 1.0,
      },
    ];

    const result = calculateRecommendationConfidenceScore(confidenceFactors);

    // 加重平均: 0.33
    // 小数第2位で四捨五入: 0.33
    expect(result.confidenceScore).toBe(0.33);
  });
});