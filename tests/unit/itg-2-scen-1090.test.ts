import {
  detectDuplicateCustomers,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1090
  test("[normal] 顧客名が正規化後に一致し他属性も一致するとき、重複と判定される", () => {
    const customerA = {
      customer_id: "CUST001",
      customer_name: "株式会社　太郎商事",
      address: "東京都渋谷区1-2-3",
      phone: "03-XXXX-0001",
    };

    const customerB = {
      customer_id: "CUST002",
      customer_name: "株式会社太郎商事",
      address: "東京都渋谷区1-2-3",
      phone: "03-XXXX-0001",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result.duplicate_status).toBe("duplicate");
    expect(result.duplicate_group_id).toBeDefined();
    expect(
      result.customers_in_group.filter(
        (c) => c.customer_id === "CUST001" || c.customer_id === "CUST002"
      ).length
    ).toBe(2);
    expect(result.merge_recommendation_score).toBeGreaterThanOrEqual(0.95);
  });
});