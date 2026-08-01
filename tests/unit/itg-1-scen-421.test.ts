import { describe, test, expect } from "@jest/globals";
import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-421
  test("同じ入力で2回レポート生成を実行した場合、同じ内容のレポートが生成される", () => {
    const salesPersonName = "田中太郎";
    const analysisStartDate = "2024-01-01";
    const analysisEndDate = "2024-01-31";
    const analysisItems = ["訪問件数", "受注件数", "平均商談時間"];

    const reportInput = {
      salesPersonName,
      analysisStartDate,
      analysisEndDate,
      analysisItems,
    };

    const firstReport = generateSalesActivityPatternAnalysisReport(reportInput);

    const firstReportId = firstReport.reportId;
    const firstGeneratedTimestamp = firstReport.generatedTimestamp;
    const firstGraphData = firstReport.graphData;
    const firstAggregatedValues = firstReport.aggregatedValues;

    const secondReport = generateSalesActivityPatternAnalysisReport(reportInput);

    const secondReportId = secondReport.reportId;
    const secondGeneratedTimestamp = secondReport.generatedTimestamp;
    const secondGraphData = secondReport.graphData;
    const secondAggregatedValues = secondReport.aggregatedValues;

    expect(firstAggregatedValues.visitCount).toBe(
      secondAggregatedValues.visitCount
    );
    expect(firstAggregatedValues.contractCount).toBe(
      secondAggregatedValues.contractCount
    );
    expect(firstAggregatedValues.averageMeetingDurationMinutes).toBe(
      secondAggregatedValues.averageMeetingDurationMinutes
    );

    expect(firstGraphData.coordinates).toEqual(secondGraphData.coordinates);
    expect(firstGraphData.labels).toEqual(secondGraphData.labels);
    expect(firstGraphData.series).toEqual(secondGraphData.series);
  });
});