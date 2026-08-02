import { calculatePurchaseSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-742
  test("購買周期がちょうど推奨間隔に達したとき、購買シグナル強度が中以上と判定される", () => {
    const recommended_purchase_interval_days = 30;
    const last_purchase_date = new Date("2024-01-15T00:00:00Z");
    const current_date = new Date("2024-02-14T00:00:00Z");

    const actual_days_elapsed = Math.floor(
      (current_date.getTime() - last_purchase_date.getTime()) / (1000 * 60 * 60 * 24)
    );

    expect(actual_days_elapsed).toBe(30);

    const result = calculatePurchaseSignalStrength({
      recommended_purchase_interval_days,
      last_purchase_date,
      current_date,
    });

    expect(
      result.signal_strength === "中" ||
        result.signal_strength === "強" ||
        result.signal_strength === "最強"
    ).toBe(true);
  });
});