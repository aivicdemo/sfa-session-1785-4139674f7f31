import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-487
  test("異なる営業担当者のレポートが相互に影響しない", async () => {
    const salesPersonAId = "SP-001";
    const salesPersonBId = "SP-002";

    const salesPersonAData = {
      salesPersonId: salesPersonAId,
      visitCount: 15,
      conversionRate: 45,
      averageMeetingDurationMinutes: 32,
    };

    const salesPersonBData = {
      salesPersonId: salesPersonBId,
      visitCount: 22,
      conversionRate: 38,
      averageMeetingDurationMinutes: 28,
    };

    const reportAIdResponse = await generateSalesPersonBehaviorAnalysisReport(
      salesPersonAData
    );
    const reportAId = reportAIdResponse.reportId;

    const reportBIdResponse = await generateSalesPersonBehaviorAnalysisReport(
      salesPersonBData
    );
    const reportBId = reportBIdResponse.reportId;

    const retrievedReportA = await generateSalesPersonBehaviorAnalysisReport({
      salesPersonId: salesPersonAId,
      operation: "retrieve",
      reportId: reportAId,
    });

    expect(retrievedReportA.metrics.visitCount).toBe(15);
    expect(retrievedReportA.metrics.conversionRate).toBe(45);
    expect(retrievedReportA.metrics.averageMeetingDurationMinutes).toBe(32);
    expect(retrievedReportA.salesPersonId).toBe(salesPersonAId);

    const retrievedReportB = await generateSalesPersonBehaviorAnalysisReport({
      salesPersonId: salesPersonBId,
      operation: "retrieve",
      reportId: reportBId,
    });

    expect(retrievedReportB.metrics.visitCount).toBe(22);
    expect(retrievedReportB.metrics.conversionRate).toBe(38);
    expect(retrievedReportB.metrics.averageMeetingDurationMinutes).toBe(28);
    expect(retrievedReportB.salesPersonId).toBe(salesPersonBId);

    const retrievedReportAAfter = await generateSalesPersonBehaviorAnalysisReport(
      {
        salesPersonId: salesPersonAId,
        operation: "retrieve",
        reportId: reportAId,
      }
    );

    expect(retrievedReportAAfter.metrics.visitCount).toBe(15);
    expect(retrievedReportAAfter.metrics.conversionRate).toBe(45);
    expect(retrievedReportAAfter.metrics.averageMeetingDurationMinutes).toBe(32);
  });
});