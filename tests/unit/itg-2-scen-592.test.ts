import { validateCompleteness } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-592
  test("完全性検証で必須項目の1つが空値の場合、不合格と判定される", () => {
    const required_fields = ["customer_name", "amount", "sales_rep_id", "deal_date"];
    const record = {
      customer_name: "",
      amount: 100000,
      sales_rep_id: "REP001",
      deal_date: "2024-01-15",
    };

    const result = validateCompleteness(record, required_fields);

    expect(result.status).toBe("failed");
    expect(result.details).toContain("customer_name");
  });
});