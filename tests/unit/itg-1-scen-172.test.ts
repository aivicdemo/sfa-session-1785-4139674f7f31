import { calculateDeviationCorrelation } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-172
  test("成約実績が1件の場合、該当担当者の乖離度との相関が計算される", () => {
    const salesRepId = "sales_rep_001";
    const contractCount = 1;

    const behaviorPatternData = {
      salesRepId: salesRepId,
      visitCount: 8,
      proposalDocumentsSent: 3,
      customerContactFrequency: 5,
      followUpCompletionRate: 0.75,
      averageProposalLeadTime: 12,
      contractCount: contractCount,
    };

    const deviationScores = [0.35, 0.28, 0.42, 0.38, 0.45];

    const result = calculateDeviationCorrelation(
      behaviorPatternData,
      deviationScores
    );

    expect(result).toHaveProperty("correlationCoefficient");
    expect(result).toHaveProperty("pValue");
    expect(result).toHaveProperty("isSignificant");

    expect(typeof result.correlationCoefficient).toBe("number");
    expect(typeof result.pValue).toBe("number");
    expect(typeof result.isSignificant).toBe("boolean");

    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-1);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(1);

    expect(result.pValue).toBeGreaterThanOrEqual(0);
    expect(result.pValue).toBeLessThanOrEqual(1);

    if (result.isSignificant) {
      expect(result.pValue).toBeLessThan(0.05);
    } else {
      expect(result.pValue).toBeGreaterThanOrEqual(0.05);
    }

    expect(result.contractCount).toBe(1);
    expect(result.sampleSize).toBe(5);
  });
});