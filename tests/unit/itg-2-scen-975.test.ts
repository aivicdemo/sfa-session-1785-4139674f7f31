import { recordPurchaseResult } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-975
  test("購買確定日時が年度をまたぐ場合に正しく記録される", () => {
    const purchase_before_fiscal_year_change = {
      purchase_id: "PUR001",
      customer_id: "CUST001",
      purchase_confirmed_at: new Date("2024-03-31T23:59:59Z"),
      product_category: "software",
      amount: 100000,
    };

    const purchase_after_fiscal_year_change = {
      purchase_id: "PUR002",
      customer_id: "CUST001",
      purchase_confirmed_at: new Date("2024-04-01T00:00:00Z"),
      product_category: "software",
      amount: 150000,
    };

    const result = recordPurchaseResult([
      purchase_before_fiscal_year_change,
      purchase_after_fiscal_year_change,
    ]);

    expect(result).toEqual([
      {
        purchase_id: "PUR001",
        customer_id: "CUST001",
        purchase_confirmed_at: new Date("2024-03-31T23:59:59Z"),
        product_category: "software",
        amount: 100000,
        fiscal_year: 2023,
      },
      {
        purchase_id: "PUR002",
        customer_id: "CUST001",
        purchase_confirmed_at: new Date("2024-04-01T00:00:00Z"),
        product_category: "software",
        amount: 150000,
        fiscal_year: 2024,
      },
    ]);

    expect(result[0].fiscal_year).toBe(2023);
    expect(result[1].fiscal_year).toBe(2024);
    expect(result[0].purchase_confirmed_at).toEqual(
      new Date("2024-03-31T23:59:59Z")
    );
    expect(result[1].purchase_confirmed_at).toEqual(
      new Date("2024-04-01T00:00:00Z")
    );
  });
});