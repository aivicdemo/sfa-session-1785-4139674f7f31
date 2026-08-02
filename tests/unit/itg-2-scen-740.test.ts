import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-740
  test("購買シグナル強度算出機能 - 過去商談記録が1件のとき、購買シグナル強度が正しく算出される", () => {
    const customerId = "CUST-001";
    const dealRecords = [
      {
        dealId: "DEAL-001",
        dealAmount: 1000000,
        closureRatio: 80,
        lastContactDate: new Date(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    ];

    const result = calculatePurchaseSignalStrength(customerId, dealRecords);

    expect(result.signalStrength).toBe(65.0);
    expect(result.signalLevel).toBe("中");
  });
});