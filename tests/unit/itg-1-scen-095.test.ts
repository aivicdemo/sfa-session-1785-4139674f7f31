import {
  generateSalesRepBehaviorAnalysisReport,
  SalesRepBehaviorAnalysisReportInput,
  SalesRepBehaviorAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者別行動パターン分析レポート生成機能", () => {
  // SCEN-095
  test("月次営業会議完了時に営業担当者別の行動パターン分析レポートが正常に生成される", () => {
    const targetMonth = "2024-01";
    const reportGenerationTimestamp = new Date("2024-02-01T09:00:00Z");

    const input: SalesRepBehaviorAnalysisReportInput = {
      targetMonth: targetMonth,
      salesRepIds: ["rep_001", "rep_002", "rep_003"],
      behaviorMetrics: [
        {
          salesRepId: "rep_001",
          initialContactCount: 12,
          proposalCount: 8,
          closingRate: 0.625,
          averageDealDurationDays: 18,
          visitCount: 15,
        },
        {
          salesRepId: "rep_002",
          initialContactCount: 10,
          proposalCount: 6,
          closingRate: 0.6,
          averageDealDurationDays: 20,
          visitCount: 12,
        },
        {
          salesRepId: "rep_003",
          initialContactCount: 14,
          proposalCount: 9,
          closingRate: 0.667,
          averageDealDurationDays: 16,
          visitCount: 18,
        },
      ],
      generatedAt: reportGenerationTimestamp,
      monthlyMeetingStatus: "completed",
    };

    const result: SalesRepBehaviorAnalysisReport = generateSalesRepBehaviorAnalysisReport(
      input
    );

    expect(result.targetMonth).toBe("2024-01");
    expect(result.salesRepCount).toBe(3);
    expect(result.status).toBe("生成完了");
    expect(result.generatedAtTimestamp).toEqual(reportGenerationTimestamp);

    expect(result.salesRepAnalyses).toHaveLength(3);

    const rep001Analysis = result.salesRepAnalyses.find(
      (a) => a.salesRepId === "rep_001"
    );
    expect(rep001Analysis).toBeDefined();
    expect(rep001Analysis?.initialContactCount).toBe(12);
    expect(rep001Analysis?.proposalCount).toBe(8);
    expect(rep001Analysis?.closingRate).toBe(0.625);
    expect(rep001Analysis?.averageDealDurationDays).toBe(18);
    expect(rep001Analysis?.visitCount).toBe(15);

    const rep002Analysis = result.salesRepAnalyses.find(
      (a) => a.salesRepId === "rep_002"
    );
    expect(rep002Analysis).toBeDefined();
    expect(rep002Analysis?.initialContactCount).toBe(10);
    expect(rep002Analysis?.proposalCount).toBe(6);
    expect(rep002Analysis?.closingRate).toBe(0.6);
    expect(rep002Analysis?.averageDealDurationDays).toBe(20);
    expect(rep002Analysis?.visitCount).toBe(12);

    const rep003Analysis = result.salesRepAnalyses.find(
      (a) => a.salesRepId === "rep_003"
    );
    expect(rep003Analysis).toBeDefined();
    expect(rep003Analysis?.initialContactCount).toBe(14);
    expect(rep003Analysis?.proposalCount).toBe(9);
    expect(rep003Analysis?.closingRate).toBe(0.667);
    expect(rep003Analysis?.averageDealDurationDays).toBe(16);
    expect(rep003Analysis?.visitCount).toBe(18);

    expect(result.reportFilePath).toBeDefined();
    expect(result.reportFilePath).toMatch(/2024-01/);
    expect(result.reportFilePath).toMatch(/\.pdf$/);

    const allSalesRepIds = result.salesRepAnalyses.map((a) => a.salesRepId);
    expect(allSalesRepIds).toContain("rep_001");
    expect(allSalesRepIds).toContain("rep_002");
    expect(allSalesRepIds).toContain("rep_003");
  });
});