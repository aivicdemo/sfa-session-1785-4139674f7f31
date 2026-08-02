import { integrateAndRecordPurchase } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-974
  test("購買確定日時が月初の場合に正しく記録される", () => {
    const purchase_date_str = "2024-01-01T00:00:00Z";
    const purchase_date = new Date(purchase_date_str);

    const input_purchase_record = {
      purchase_id: "PUR-20240101-001",
      customer_id: "CUST-001",
      product_id: "PROD-100",
      purchase_amount: 50000,
      purchase_date_time: purchase_date,
      status: "confirmed",
    };

    const result = integrateAndRecordPurchase(input_purchase_record);

    expect(result).toEqual(
      expect.objectContaining({
        purchase_id: "PUR-20240101-001",
        customer_id: "CUST-001",
        product_id: "PROD-100",
        purchase_amount: 50000,
        purchase_date_time: purchase_date,
        status: "confirmed",
        recorded_at: expect.any(Date),
        fiscal_month_classification: "month_start",
      })
    );

    expect(result.purchase_date_time.toISOString()).toBe(purchase_date_str);
    expect(result.purchase_date_time.getDate()).toBe(1);
    expect(result.purchase_date_time.getHours()).toBe(0);
    expect(result.purchase_date_time.getMinutes()).toBe(0);
    expect(result.purchase_date_time.getSeconds()).toBe(0);
    expect(result.fiscal_month_classification).toBe("month_start");
  });
});