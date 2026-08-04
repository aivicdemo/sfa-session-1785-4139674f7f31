import { aggregateDataQualityReport } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質レポート集計機能", () => {
  // SCEN-435
  test("検証対象期間が月初と月末にまたがる場合、全検証結果が集計される", () => {
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-01-31T23:59:59Z");

    // 検証結果データの事前投入: 月初付近3件
    const earlyMonthResults = [
      {
        verificationId: "VR001",
        verificationDate: new Date("2024-01-01T08:30:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR002",
        verificationDate: new Date("2024-01-02T09:15:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR003",
        verificationDate: new Date("2024-01-03T10:45:00Z"),
        verificationStatus: "failure",
        checkItemCount: 15,
        abnormalDataCount: 2,
      },
    ];

    // 月中の検証結果5件
    const midMonthResults = [
      {
        verificationId: "VR004",
        verificationDate: new Date("2024-01-10T11:20:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR005",
        verificationDate: new Date("2024-01-15T14:30:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR006",
        verificationDate: new Date("2024-01-17T09:00:00Z"),
        verificationStatus: "failure",
        checkItemCount: 15,
        abnormalDataCount: 3,
      },
      {
        verificationId: "VR007",
        verificationDate: new Date("2024-01-20T13:45:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR008",
        verificationDate: new Date("2024-01-25T16:10:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
    ];

    // 月末付近の検証結果2件
    const lateMonthResults = [
      {
        verificationId: "VR009",
        verificationDate: new Date("2024-01-29T10:30:00Z"),
        verificationStatus: "success",
        checkItemCount: 15,
        abnormalDataCount: 0,
      },
      {
        verificationId: "VR010",
        verificationDate: new Date("2024-01-31T15:55:00Z"),
        verificationStatus: "failure",
        checkItemCount: 15,
        abnormalDataCount: 1,
      },
    ];

    const allVerificationResults = [
      ...earlyMonthResults,
      ...midMonthResults,
      ...lateMonthResults,
    ];

    const result = aggregateDataQualityReport({
      startDate,
      endDate,
      verificationResults: allVerificationResults,
    });

    // 集計結果の検証
    expect(result.totalVerificationCount).toBe(10);
    expect(result.successCount).toBe(7);
    expect(result.failureCount).toBe(3);
    expect(result.totalAbnormalDataCount).toBe(6);

    // 月初の検証結果が含まれていることを確認
    const earlyMonthIncluded = result.aggregatedResults.filter(
      (r) =>
        r.verificationDate >= new Date("2024-01-01T00:00:00Z") &&
        r.verificationDate <= new Date("2024-01-03T23:59:59Z")
    );
    expect(earlyMonthIncluded.length).toBe(3);

    // 月中の検証結果が含まれていることを確認
    const midMonthIncluded = result.aggregatedResults.filter(
      (r) =>
        r.verificationDate >= new Date("2024-01-04T00:00:00Z") &&
        r.verificationDate <= new Date("2024-01-28T23:59:59Z")
    );
    expect(midMonthIncluded.length).toBe(5);

    // 月末の検証結果が含まれていることを確認
    const lateMonthIncluded = result.aggregatedResults.filter(
      (r) =>
        r.verificationDate >= new Date("2024-01-29T00:00:00Z") &&
        r.verificationDate <= new Date("2024-01-31T23:59:59Z")
    );
    expect(lateMonthIncluded.length).toBe(2);

    // 各検証結果の日付が期間内であることを確認
    result.aggregatedResults.forEach((verResult) => {
      expect(verResult.verificationDate.getTime()).toBeGreaterThanOrEqual(
        startDate.getTime()
      );
      expect(verResult.verificationDate.getTime()).toBeLessThanOrEqual(
        endDate.getTime()
      );
    });

    // 検証詳細（状態、チェック項目数、異常データ件数）が正確に集計されていることを確認
    expect(result.aggregatedResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          verificationId: "VR001",
          verificationStatus: "success",
          checkItemCount: 15,
          abnormalDataCount: 0,
        }),
        expect.objectContaining({
          verificationId: "VR003",
          verificationStatus: "failure",
          checkItemCount: 15,
          abnormalDataCount: 2,
        }),
        expect.objectContaining({
          verificationId: "VR006",
          verificationStatus: "failure",
          checkItemCount: 15,
          abnormalDataCount: 3,
        }),
        expect.objectContaining({
          verificationId: "VR010",
          verificationStatus: "failure",
          checkItemCount: 15,
          abnormalDataCount: 1,
        }),
      ])
    );
  });
});