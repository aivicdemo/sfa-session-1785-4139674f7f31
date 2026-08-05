import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeActionPatternByMonth } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-451
  test("営業担当者の月間反応データが月末月初をまたがるとき期間区切りが正しく判定される", () => {
    const salesPersonId = "SP001";
    const actionDataCrossingMonthBoundary = [
      {
        salesPersonId,
        responseDate: new Date("2024-01-31T09:00:00Z"),
        actionType: "phone_call",
        responseStatus: "success",
        customerId: "CUST001",
        dealId: "DEAL001",
      },
      {
        salesPersonId,
        responseDate: new Date("2024-01-31T14:30:00Z"),
        actionType: "email",
        responseStatus: "success",
        customerId: "CUST002",
        dealId: "DEAL002",
      },
      {
        salesPersonId,
        responseDate: new Date("2024-01-31T16:45:00Z"),
        actionType: "meeting",
        responseStatus: "success",
        customerId: "CUST003",
        dealId: "DEAL003",
      },
      {
        salesPersonId,
        responseDate: new Date("2024-02-01T08:00:00Z"),
        actionType: "phone_call",
        responseStatus: "success",
        customerId: "CUST004",
        dealId: "DEAL004",
      },
      {
        salesPersonId,
        responseDate: new Date("2024-02-01T11:15:00Z"),
        actionType: "email",
        responseStatus: "success",
        customerId: "CUST005",
        dealId: "DEAL005",
      },
    ];

    const result = analyzeActionPatternByMonth({
      salesPersonId,
      actionData: actionDataCrossingMonthBoundary,
    });

    expect(result).toEqual({
      salesPersonId,
      periods: [
        {
          yearMonth: "2024-01",
          totalResponseCount: 3,
          responsesByType: {
            phone_call: 1,
            email: 1,
            meeting: 1,
          },
          successCount: 3,
          successRate: 100,
        },
        {
          yearMonth: "2024-02",
          totalResponseCount: 2,
          responsesByType: {
            phone_call: 1,
            email: 1,
            meeting: 0,
          },
          successCount: 2,
          successRate: 100,
        },
      ],
    });
  });
});