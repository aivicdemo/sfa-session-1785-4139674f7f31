import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-769
  test("[normal] 購買シグナル算出全体 - 同じ顧客データで2回実行しても購買シグナル強度が同じ結果になる", () => {
    const customerData = {
      customerId: "CUST-001",
      industry: "製造",
      employeeCount: 500,
      previousMonthInquiries: 3,
      websiteVisitFrequency: "weekly_2_times",
    };

    const firstExecutionResult = calculatePurchaseSignalStrength(customerData);
    const secondExecutionResult = calculatePurchaseSignalStrength(customerData);

    expect(firstExecutionResult).toBe(secondExecutionResult);
  });
});