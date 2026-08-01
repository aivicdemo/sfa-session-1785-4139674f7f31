import { describe, test, expect } from "@jest/globals";
import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-367
  test("分析対象期間の開始日と終了日が同日のとき、その日のデータのみで計算される", () => {
    const salesPersonName = "田中太郎";
    const analysisStartDate = new Date("2024-01-15T00:00:00Z");
    const analysisEndDate = new Date("2024-01-15T23:59:59Z");

    const mockActivityData = [
      {
        salesPersonName: "田中太郎",
        activityDate: new Date("2024-01-15T10:30:00Z"),
        activityType: "visit",
        count: 3,
      },
      {
        salesPersonName: "田中太郎",
        activityDate: new Date("2024-01-15T14:15:00Z"),
        activityType: "negotiation",
        count: 2,
      },
      {
        salesPersonName: "田中太郎",
        activityDate: new Date("2024-01-15T16:45:00Z"),
        activityType: "contract",
        amount: 500000,
      },
      {
        salesPersonName: "田中太郎",
        activityDate: new Date("2024-01-16T09:00:00Z"),
        activityType: "visit",
        count: 5,
      },
      {
        salesPersonName: "田中太郎",
        activityDate: new Date("2024-01-14T11:00:00Z"),
        activityType: "visit",
        count: 2,
      },
    ];

    const report = generateBehaviorPatternAnalysisReport(
      salesPersonName,
      analysisStartDate,
      analysisEndDate,
      mockActivityData
    );

    expect(report.analysisStartDate).toEqual(new Date("2024-01-15T00:00:00Z"));
    expect(report.analysisEndDate).toEqual(new Date("2024-01-15T23:59:59Z"));
    expect(report.analysisDurationDays).toBe(1);
    expect(report.visitCount).toBe(3);
    expect(report.negotiationCount).toBe(2);
    expect(report.contractAmount).toBe(500000);
    expect(report.salesPersonName).toBe("田中太郎");
    expect(report.includedActivitiesCount).toBe(3);
  });
});