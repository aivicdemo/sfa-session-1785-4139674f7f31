import { generateSalesActivityPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1159
  test("営業活動ログの時系列が逆順で入力されるとき時系列に並べ直して分析される", () => {
    const salesPersonId = "tanaka-taro";
    const salesPersonName = "田中太郎";

    const reverseOrderActivityLogs = [
      {
        activityId: "act-5",
        salesPersonId: salesPersonId,
        timestamp: new Date("2024-01-05T15:30:00Z"),
        activityType: "顧客面談",
        customerId: "cust-001",
        duration: 60,
        outcome: "良好",
      },
      {
        activityId: "act-4",
        salesPersonId: salesPersonId,
        timestamp: new Date("2024-01-04T10:15:00Z"),
        activityType: "提案資料送付",
        customerId: "cust-001",
        duration: 30,
        outcome: "完了",
      },
      {
        activityId: "act-3",
        salesPersonId: salesPersonId,
        timestamp: new Date("2024-01-03T14:20:00Z"),
        activityType: "初回訪問",
        customerId: "cust-001",
        duration: 45,
        outcome: "完了",
      },
      {
        activityId: "act-2",
        salesPersonId: salesPersonId,
        timestamp: new Date("2024-01-02T09:00:00Z"),
        activityType: "電話確認",
        customerId: "cust-001",
        duration: 15,
        outcome: "完了",
      },
      {
        activityId: "act-1",
        salesPersonId: salesPersonId,
        timestamp: new Date("2024-01-01T16:45:00Z"),
        activityType: "リード獲得",
        customerId: "cust-001",
        duration: 0,
        outcome: "新規",
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId: salesPersonId,
      salesPersonName: salesPersonName,
      activityLogs: reverseOrderActivityLogs,
      analysisStartDate: new Date("2024-01-01T00:00:00Z"),
      analysisEndDate: new Date("2024-01-05T23:59:59Z"),
    });

    expect(report.salesPersonName).toBe("田中太郎");
    expect(report.analysisTargetPeriod).toBe("2024-01-01～2024-01-05（5日間）");

    expect(report.activityTimeline).toHaveLength(5);

    expect(report.activityTimeline[0]).toMatchObject({
      activityId: "act-1",
      timestamp: new Date("2024-01-01T16:45:00Z"),
      activityType: "リード獲得",
    });

    expect(report.activityTimeline[1]).toMatchObject({
      activityId: "act-2",
      timestamp: new Date("2024-01-02T09:00:00Z"),
      activityType: "電話確認",
    });

    expect(report.activityTimeline[2]).toMatchObject({
      activityId: "act-3",
      timestamp: new Date("2024-01-03T14:20:00Z"),
      activityType: "初回訪問",
    });

    expect(report.activityTimeline[3]).toMatchObject({
      activityId: "act-4",
      timestamp: new Date("2024-01-04T10:15:00Z"),
      activityType: "提案資料送付",
    });

    expect(report.activityTimeline[4]).toMatchObject({
      activityId: "act-5",
      timestamp: new Date("2024-01-05T15:30:00Z"),
      activityType: "顧客面談",
    });

    for (let i = 0; i < report.activityTimeline.length - 1; i++) {
      const currentTime = report.activityTimeline[i].timestamp.getTime();
      const nextTime = report.activityTimeline[i + 1].timestamp.getTime();
      expect(currentTime).toBeLessThanOrEqual(nextTime);
    }
  });
});