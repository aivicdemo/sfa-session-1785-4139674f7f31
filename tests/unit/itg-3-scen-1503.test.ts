import { evaluateDataQuality } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  // SCEN-1503
  test("購買金額が0のとき不適合項目に追加される", () => {
    const purchase_record = {
      id: "PURCHASE_001",
      customer_id: "CUST_123",
      purchase_date: "2024-01-15",
      purchase_amount: 0,
      quantity: 5,
      product_id: "PROD_456",
    };

    const result = evaluateDataQuality(purchase_record);

    expect(result.is_failed).toBe(true);
    expect(result.non_conformance_items.length).toBeGreaterThanOrEqual(1);

    const amount_error = result.non_conformance_items.find(
      (item: { error_code: string; error_message: string }) =>
        item.error_code === "PURCHASE_AMOUNT_ZERO"
    );

    expect(amount_error).toBeDefined();
    expect(amount_error.error_message).toMatch(/購買金額/);
    expect(amount_error.error_message).toMatch(/0/);
    expect(result.record_id).toBe("PURCHASE_001");
  });
});