import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1149
  test("標準プロセスとの乖離率がちょうど許容閾値のとき正常に分類される", () => {
    const employeeId = "EMP-001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");
    const toleranceThreshold = 5;

    const standardProcessContractRate = 70;
    const standardProcessVisitCountPerMonth = 20;

    const actualContractRate = 66.5;
    const actualVisitCount = 19;

    const contractRateDeviationPercent = actualContractRate - standardProcessContractRate;
    const visitCountDeviationPercent = ((actualVisitCount - standardProcessVisitCountPerMonth) / standardProcessVisitCountPerMonth) * 100;

    const behaviorPatternData = {
      employeeId: employeeId,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
      standardProcessContractRate: standardProcessContractRate,
      standardProcessVisitCountPerMonth: standardProcessVisitCountPerMonth,
      actualContractRate: actualContractRate,
      actualVisitCount: actualVisitCount,
      toleranceThreshold: toleranceThreshold,
    };

    const result = generateBehaviorPatternAnalysisReport(behaviorPatternData);

    expect(result.classificationStatus).toBe("WITHIN_THRESHOLD");
    expect(result.requiresAttention).toBe(false);
    expect(result.contractRateDeviationPercent).toBe(-3.5);
    expect(result.visitCountDeviationPercent).toBe(-5);
    expect(result.contractRateWithinThreshold).toBe(true);
    expect(result.visitCountWithinThreshold).toBe(true);
  });
});