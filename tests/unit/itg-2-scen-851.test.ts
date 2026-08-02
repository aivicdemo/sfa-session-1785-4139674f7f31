import { analyzeOperationalProcessExecution } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 営業プロセス実行状況分析", () => {
  test("SCEN-851: 分析対象期間が月初を含むとき、月初のデータが正しく対象に含まれる", () => {
    const analysisPeriodStart = new Date("2024-04-01T00:00:00Z");
    const analysisPeriodEnd = new Date("2024-04-30T23:59:59Z");

    const salesActivities = [
      {
        dealId: "DEAL-20240401-001",
        recordedAt: new Date("2024-04-01T09:30:00Z"),
        amount: 1000000,
        activityType: "初回接触",
      },
      {
        dealId: "DEAL-20240415-002",
        recordedAt: new Date("2024-04-15T14:00:00Z"),
        amount: 2000000,
        activityType: "提案",
      },
      {
        dealId: "DEAL-20240330-003",
        recordedAt: new Date("2024-03-30T10:00:00Z"),
        amount: 500000,
        activityType: "初回接触",
      },
    ];

    const analysisResult = analyzeOperationalProcessExecution({
      periodStart: analysisPeriodStart,
      periodEnd: analysisPeriodEnd,
      activities: salesActivities,
    });

    expect(analysisResult.includedActivitiesCount).toBe(2);
    expect(analysisResult.totalAmount).toBe(3000000);
    expect(
      analysisResult.includedActivities.some(
        (activity) => activity.dealId === "DEAL-20240401-001"
      )
    ).toBe(true);

    const aprilFirstActivity = analysisResult.includedActivities.find(
      (activity) => activity.dealId === "DEAL-20240401-001"
    );
    expect(aprilFirstActivity).toBeDefined();
    expect(aprilFirstActivity?.amount).toBe(1000000);
    expect(aprilFirstActivity?.recordedAt).toEqual(
      new Date("2024-04-01T09:30:00Z")
    );
  });
});