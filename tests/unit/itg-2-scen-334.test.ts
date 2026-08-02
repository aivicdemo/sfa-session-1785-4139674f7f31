import { calculatePriorityScoreForNegativeCorrelation } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-334
  test("相関係数が負の値となる場合、改善指導の優先順位が適切に計算される", () => {
    const negativeCorrCoef = -0.8;
    const positiveCorrCoef = 0.8;

    const negativeCorrelationResult = calculatePriorityScoreForNegativeCorrelation(
      {
        correlationCoefficient: negativeCorrCoef,
        metric1: "customer_satisfaction",
        metric2: "churn_rate",
        dataPoints: 50,
      }
    );

    const positiveCorrelationResult = calculatePriorityScoreForNegativeCorrelation(
      {
        correlationCoefficient: positiveCorrCoef,
        metric1: "customer_satisfaction",
        metric2: "churn_rate",
        dataPoints: 50,
      }
    );

    expect(negativeCorrelationResult.priorityScore).toBeGreaterThan(
      positiveCorrelationResult.priorityScore
    );
    expect(negativeCorrelationResult.priorityRank).toBe(2);
    expect(negativeCorrelationResult.priorityRank).toBeGreaterThanOrEqual(2);
    expect(negativeCorrelationResult.priorityRank).toBeLessThanOrEqual(5);
  });
});