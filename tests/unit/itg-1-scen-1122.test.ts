import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1122
  test("分析期間中に営業担当者の異動があり、組織ID変動があるとき、処理がエラーになること", () => {
    const salesRepId = "SALES001";
    const analysisPeriodStart = new Date("2024-01-01T00:00:00Z");
    const analysisPeriodEnd = new Date("2024-01-31T23:59:59Z");

    const behaviorDataBeforeTransfer = [
      {
        salesRepId: "SALES001",
        organizationId: "ORG-TOKYO",
        activityDate: new Date("2024-01-01T09:00:00Z"),
        activityType: "visit",
        customerId: "CUST001",
      },
      {
        salesRepId: "SALES001",
        organizationId: "ORG-TOKYO",
        activityDate: new Date("2024-01-15T14:30:00Z"),
        activityType: "proposal",
        customerId: "CUST002",
      },
    ];

    const organizationTransferEvent = {
      salesRepId: "SALES001",
      previousOrganizationId: "ORG-TOKYO",
      newOrganizationId: "ORG-OSAKA",
      transferDate: new Date("2024-01-16T00:00:00Z"),
    };

    const behaviorDataAfterTransfer = [
      {
        salesRepId: "SALES001",
        organizationId: "ORG-OSAKA",
        activityDate: new Date("2024-01-20T10:00:00Z"),
        activityType: "visit",
        customerId: "CUST003",
      },
      {
        salesRepId: "SALES001",
        organizationId: "ORG-OSAKA",
        activityDate: new Date("2024-01-31T16:00:00Z"),
        activityType: "followup",
        customerId: "CUST004",
      },
    ];

    const allBehaviorData = [
      ...behaviorDataBeforeTransfer,
      ...behaviorDataAfterTransfer,
    ];

    const organizationTransfers = [organizationTransferEvent];

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        salesRepId: salesRepId,
        analysisPeriodStart: analysisPeriodStart,
        analysisPeriodEnd: analysisPeriodEnd,
        behaviorData: allBehaviorData,
        organizationTransfers: organizationTransfers,
      })
    ).toThrow(/ERR_INCONSISTENT_ORG_ID/);

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        salesRepId: salesRepId,
        analysisPeriodStart: analysisPeriodStart,
        analysisPeriodEnd: analysisPeriodEnd,
        behaviorData: allBehaviorData,
        organizationTransfers: organizationTransfers,
      })
    ).toThrow(/営業担当者SALES001の組織IDが分析期間内に変動しています/);

    expect(() =>
      generateSalesRepBehaviorAnalysisReport({
        salesRepId: salesRepId,
        analysisPeriodStart: analysisPeriodStart,
        analysisPeriodEnd: analysisPeriodEnd,
        behaviorData: allBehaviorData,
        organizationTransfers: organizationTransfers,
      })
    ).toThrow(/ORG-TOKYOからORG-OSAKAへの異動が検出されました/);
  });
});