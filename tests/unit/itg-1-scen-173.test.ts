import { calculateSalesPerformanceCorrelation } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-173
  test("should calculate correlation coefficient across multiple sales achievements with deviation scores", () => {
    const salesPersonId = "sp_001";
    const salesAchievements = [
      {
        id: "sa_001",
        salesPersonId: salesPersonId,
        achievementDate: "2024-01-15",
        amount: 500000,
        productCategory: "A",
        deviationScore: 0.3,
      },
      {
        id: "sa_002",
        salesPersonId: salesPersonId,
        achievementDate: "2024-02-20",
        amount: 750000,
        productCategory: "B",
        deviationScore: 0.5,
      },
      {
        id: "sa_003",
        salesPersonId: salesPersonId,
        achievementDate: "2024-03-10",
        amount: 1000000,
        productCategory: "C",
        deviationScore: 0.7,
      },
    ];

    const result = calculateSalesPerformanceCorrelation({
      salesPersonId: salesPersonId,
      salesAchievements: salesAchievements,
    });

    expect(result.salesPersonId).toBe("sp_001");
    expect(result.achievementCount).toBe(3);
    expect(result.deviationScores).toEqual([0.3, 0.5, 0.7]);
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationCoefficient).toBeLessThanOrEqual(1.0);
    expect(typeof result.correlationCoefficient).toBe("number");
    expect(result.achievementDetails).toHaveLength(3);
    expect(result.achievementDetails[0]).toMatchObject({
      id: "sa_001",
      deviationScore: 0.3,
    });
    expect(result.achievementDetails[1]).toMatchObject({
      id: "sa_002",
      deviationScore: 0.5,
    });
    expect(result.achievementDetails[2]).toMatchObject({
      id: "sa_003",
      deviationScore: 0.7,
    });
  });
});