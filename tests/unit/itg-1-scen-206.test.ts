import { analyzeActionPatternAndJudgeCoachingTarget } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-206
  test("営業担当者行動パターン分析・改善指導対象判定機能 - 営業担当者の行動状態が標準プロセス実行中である場合、進行中データが集計される", () => {
    const salesRepId = "SR001";
    const actionState = "標準プロセス実行中";
    const analysisPeriodDays = 30;
    const activityLog = [
      {
        id: "AL001",
        salesRepId: salesRepId,
        activityType: "商談",
        timestamp: new Date("2024-01-10T09:00:00Z"),
      },
      {
        id: "AL002",
        salesRepId: salesRepId,
        activityType: "商談",
        timestamp: new Date("2024-01-12T10:30:00Z"),
      },
      {
        id: "AL003",
        salesRepId: salesRepId,
        activityType: "商談",
        timestamp: new Date("2024-01-15T14:00:00Z"),
      },
      {
        id: "AL004",
        salesRepId: salesRepId,
        activityType: "商談",
        timestamp: new Date("2024-01-18T11:00:00Z"),
      },
      {
        id: "AL005",
        salesRepId: salesRepId,
        activityType: "商談",
        timestamp: new Date("2024-01-20T13:00:00Z"),
      },
      {
        id: "AL006",
        salesRepId: salesRepId,
        activityType: "提案",
        timestamp: new Date("2024-01-12T10:30:00Z"),
      },
      {
        id: "AL007",
        salesRepId: salesRepId,
        activityType: "提案",
        timestamp: new Date("2024-01-15T14:00:00Z"),
      },
      {
        id: "AL008",
        salesRepId: salesRepId,
        activityType: "提案",
        timestamp: new Date("2024-01-18T11:00:00Z"),
      },
      {
        id: "AL009",
        salesRepId: salesRepId,
        activityType: "受注",
        timestamp: new Date("2024-01-20T13:00:00Z"),
      },
    ];

    const result = analyzeActionPatternAndJudgeCoachingTarget({
      salesRepId: salesRepId,
      actionState: actionState,
      analysisPeriodDays: analysisPeriodDays,
      activityLog: activityLog,
      referenceDate: new Date("2024-02-20T00:00:00Z"),
    });

    expect(result.salesRepId).toBe(salesRepId);
    expect(result.actionState).toBe("標準プロセス実行中");
    expect(result.aggregatedData.negotiationCount).toBe(5);
    expect(result.aggregatedData.proposalCount).toBe(3);
    expect(result.aggregatedData.contractCount).toBe(1);
    expect(result.isAggregationTargetIncluded).toBe(true);
    expect(result.coachingRequiredFlag).toBe(false);
    expect(result.actionStateAfterJudgment).toBe("標準プロセス実行中");
  });
});