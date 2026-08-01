import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-315: 指定期間内に営業活動ログが複数件の場合、すべてのログが行動パターン分析に含まれる", () => {
    const employeeId = "EMP-001";
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-01-31T23:59:59Z");

    const salesActivityLogs = [
      {
        logId: "LOG-001",
        employeeId: employeeId,
        activityType: "顧客訪問",
        activityDate: new Date("2024-01-05T10:00:00Z"),
        customerId: "CUST-101",
        duration: 60,
        outcome: "提案実施",
      },
      {
        logId: "LOG-002",
        employeeId: employeeId,
        activityType: "顧客訪問",
        activityDate: new Date("2024-01-10T14:00:00Z"),
        customerId: "CUST-102",
        duration: 45,
        outcome: "ニーズ確認",
      },
      {
        logId: "LOG-003",
        employeeId: employeeId,
        activityType: "顧客訪問",
        activityDate: new Date("2024-01-15T09:30:00Z"),
        customerId: "CUST-103",
        duration: 90,
        outcome: "契約締結",
      },
      {
        logId: "LOG-004",
        employeeId: employeeId,
        activityType: "電話営業",
        activityDate: new Date("2024-01-20T11:00:00Z"),
        customerId: "CUST-104",
        duration: 20,
        outcome: "フォローアップ",
      },
      {
        logId: "LOG-005",
        employeeId: employeeId,
        activityType: "電話営業",
        activityDate: new Date("2024-01-25T16:30:00Z"),
        customerId: "CUST-105",
        duration: 15,
        outcome: "初期接触",
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport(
      employeeId,
      startDate,
      endDate,
      salesActivityLogs
    );

    expect(report.analysisTargetLogCount).toBe(5);
    expect(report.includedLogs).toHaveLength(5);
    expect(report.includedLogs.map((log) => log.logId)).toEqual([
      "LOG-001",
      "LOG-002",
      "LOG-003",
      "LOG-004",
      "LOG-005",
    ]);

    const activityTypeDistribution = report.behaviorPatternAnalysisResult
      .activityTypeDistribution;
    expect(activityTypeDistribution["顧客訪問"]).toBe(3);
    expect(activityTypeDistribution["電話営業"]).toBe(2);

    expect(report.behaviorPatternAnalysisResult.totalActivityCount).toBe(5);
  });
});