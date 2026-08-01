import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-417
  test("営業担当者の分析データが1件の場合、その営業担当者のレポートが生成される", async () => {
    const employeeId = "EMP001";
    const visitCount = 5;
    const contractCount = 2;
    const averageMeetingDurationMinutes = 45;
    const expectedContractRate = 40;

    const analysisData = {
      employeeId,
      visitCount,
      contractCount,
      averageMeetingDurationMinutes,
      behaviorPatternAnalysisResult: "pattern_identified",
    };

    const report = await generateSalesPersonBehaviorAnalysisReport(
      analysisData
    );

    expect(report.employeeId).toBe("EMP001");
    expect(report.visitCount).toBe(5);
    expect(report.contractCount).toBe(2);
    expect(report.contractRate).toBe(40);
    expect(report.averageMeetingDurationMinutes).toBe(45);
    expect(report.behaviorPatternAnalysisResult).toBe("pattern_identified");
  });
});