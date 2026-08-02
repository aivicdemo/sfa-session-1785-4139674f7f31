import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-739
  test("過去商談記録が0件のとき、購買シグナル強度が「弱」と判定される", () => {
    const customer_id = "CUST-001";
    const deal_records = [];

    const result = calculatePurchaseSignalStrength({
      customer_id,
      deal_records,
    });

    expect(result.strength).toBe("weak");
  });
});