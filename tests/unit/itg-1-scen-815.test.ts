import { analyzeUserBehaviorPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-815
  test("分析対象期間の開始日と終了日が同日の場合、その1日のみの活動で分析を実行する", () => {
    const startDate = new Date("2024-01-15T00:00:00Z");
    const endDate = new Date("2024-01-15T23:59:59Z");
    const salesPersonId = "sales_taro";

    const mockActivityData = [
      {
        date: new Date("2024-01-15T09:30:00Z"),
        type: "visit",
        duration_minutes: 0,
        count: 3,
      },
      {
        date: new Date("2024-01-15T14:00:00Z"),
        type: "call",
        duration_minutes: 45,
        count: 1,
      },
      {
        date: new Date("2024-01-15T16:00:00Z"),
        type: "email",
        duration_minutes: 0,
        count: 5,
      },
      {
        date: new Date("2024-01-15T17:30:00Z"),
        type: "proposal",
        duration_minutes: 0,
        count: 1,
      },
    ];

    const result = analyzeUserBehaviorPattern({
      salesPersonId: salesPersonId,
      startDate: startDate,
      endDate: endDate,
      activityData: mockActivityData,
    });

    expect(result.analysisStartDate).toEqual(new Date("2024-01-15T00:00:00Z"));
    expect(result.analysisEndDate).toEqual(new Date("2024-01-15T23:59:59Z"));
    expect(result.analysisDateDisplay).toBe("2024年1月15日～2024年1月15日");
    expect(result.activityStatistics.visitCount).toBe(3);
    expect(result.activityStatistics.callDurationMinutes).toBe(45);
    expect(result.activityStatistics.emailCount).toBe(5);
    expect(result.activityStatistics.proposalCount).toBe(1);
    expect(result.activityStatistics.totalActivityDays).toBe(1);
    expect(result.activityStatistics.activitiesByDate).toHaveLength(1);
    expect(result.activityStatistics.activitiesByDate[0].date).toEqual(
      new Date("2024-01-15")
    );
  });
});