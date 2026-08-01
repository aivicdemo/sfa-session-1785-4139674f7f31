import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-619: フォローアップ成功率が正確に計算される", () => {
    // テストデータ準備：営業担当者Aの過去30日間のフォローアップ活動記録
    const salesRepId = "rep_001";
    const followupActivities = [
      {
        activityId: "fup_001",
        salesRepId: salesRepId,
        activityDate: "2024-01-01T09:00:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_002",
        salesRepId: salesRepId,
        activityDate: "2024-01-02T10:30:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_003",
        salesRepId: salesRepId,
        activityDate: "2024-01-03T14:15:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_004",
        salesRepId: salesRepId,
        activityDate: "2024-01-04T11:00:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_005",
        salesRepId: salesRepId,
        activityDate: "2024-01-05T15:45:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_006",
        salesRepId: salesRepId,
        activityDate: "2024-01-06T09:20:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_007",
        salesRepId: salesRepId,
        activityDate: "2024-01-07T13:30:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_008",
        salesRepId: salesRepId,
        activityDate: "2024-01-08T10:00:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_009",
        salesRepId: salesRepId,
        activityDate: "2024-01-09T16:00:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_010",
        salesRepId: salesRepId,
        activityDate: "2024-01-10T12:45:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_011",
        salesRepId: salesRepId,
        activityDate: "2024-01-11T08:30:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_012",
        salesRepId: salesRepId,
        activityDate: "2024-01-12T14:20:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_013",
        salesRepId: salesRepId,
        activityDate: "2024-01-13T11:15:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_014",
        salesRepId: salesRepId,
        activityDate: "2024-01-14T09:50:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_015",
        salesRepId: salesRepId,
        activityDate: "2024-01-15T15:30:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_016",
        salesRepId: salesRepId,
        activityDate: "2024-01-16T10:10:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_017",
        salesRepId: salesRepId,
        activityDate: "2024-01-17T13:40:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_018",
        salesRepId: salesRepId,
        activityDate: "2024-01-18T12:00:00Z",
        activityType: "followup",
        result: "success",
      },
      {
        activityId: "fup_019",
        salesRepId: salesRepId,
        activityDate: "2024-01-19T14:50:00Z",
        activityType: "followup",
        result: "failure",
      },
      {
        activityId: "fup_020",
        salesRepId: salesRepId,
        activityDate: "2024-01-20T11:25:00Z",
        activityType: "followup",
        result: "success",
      },
    ];

    // 成功件数と失敗件数の確認
    const successCount = followupActivities.filter(
      (activity) => activity.result === "success"
    ).length;
    const failureCount = followupActivities.filter(
      (activity) => activity.result === "failure"
    ).length;
    const totalCount = followupActivities.length;

    // 期待値の計算：12件 ÷ 20件 × 100 = 60.0%
    const expectedFollowupSuccessRate = 60.0;

    // 行動パターン分析レポート生成機能を実行
    const report = generateSalesRepBehaviorAnalysisReport({
      salesRepId: salesRepId,
      followupActivities: followupActivities,
      analysisStartDate: "2024-01-01T00:00:00Z",
      analysisEndDate: "2024-01-30T23:59:59Z",
    });

    // レポートが正常に生成されたことを確認
    expect(report).toBeDefined();
    expect(report.salesRepId).toBe(salesRepId);

    // フォローアップ成功率が期待値と一致することを検証
    expect(report.followupSuccessRate).toBe(expectedFollowupSuccessRate);

    // 合計フォローアップ件数の検証
    expect(report.totalFollowupActivities).toBe(totalCount);

    // 成功件数の検証
    expect(report.successfulFollowupCount).toBe(successCount);

    // 失敗件数の検証
    expect(report.failedFollowupCount).toBe(failureCount);
  });
});