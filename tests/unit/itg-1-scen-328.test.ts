import { describe, test, expect } from "@jest/globals";
import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-328
  test("営業案件データが欠落している場合、乖離度計算が正常に処理される", () => {
    const salesPersonId = "A001";
    const projects = [
      {
        projectId: "P001",
        salesPersonId: salesPersonId,
        projectName: "案件A",
        initialContactDate: null,
        proposalDate: new Date("2024-01-20"),
        negotiationDate: new Date("2024-02-01"),
        closureDate: new Date("2024-02-15"),
        standardProcessDeviationDegree: 0,
      },
      {
        projectId: "P002",
        salesPersonId: salesPersonId,
        projectName: "案件B",
        initialContactDate: new Date("2024-01-10"),
        proposalDate: new Date("2024-01-25"),
        negotiationDate: new Date("2024-02-05"),
        closureDate: new Date("2024-02-20"),
        standardProcessDeviationDegree: 0,
      },
      {
        projectId: "P003",
        salesPersonId: salesPersonId,
        projectName: "案件C",
        initialContactDate: new Date("2024-01-15"),
        proposalDate: new Date("2024-01-28"),
        negotiationDate: new Date("2024-02-08"),
        closureDate: new Date("2024-02-25"),
        standardProcessDeviationDegree: 0,
      },
    ];

    const result = generateBehaviorPatternAnalysisReport({
      salesPersonId: salesPersonId,
      projects: projects,
    });

    expect(result.projectsProcessed).toBe(2);
    expect(result.missingDataCount).toBe(1);
    expect(result.deviationDegreeCalculated).toBe(true);
    expect(result.reportGenerated).toBe(true);
    expect(result.averageDeviationDegree).toBeGreaterThanOrEqual(0);
    expect(result.averageDeviationDegree).toBeLessThanOrEqual(100);
  });
});