import { detectDuplicateCustomer } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複判定・統合エンジン", () => {
  // SCEN-1091
  test("重複判定スコアが閾値と完全に一致するとき、重複と判定される", () => {
    const threshold = 0.85;
    const matchingScore = 0.85;

    const customerA = {
      customer_id: "CUST-001",
      customer_name: "山田太郎",
      customer_email: "yamada@example.com",
      customer_address: "",
    };

    const customerB = {
      customer_id: "CUST-002",
      customer_name: "山田太郎",
      customer_email: "yamada@example.com",
      customer_address: "東京都渋谷区",
    };

    const result = detectDuplicateCustomer({
      threshold: threshold,
      matching_score: matchingScore,
      customer_a: customerA,
      customer_b: customerB,
    });

    expect(result.duplicate_status).toBe("重複と判定");
    expect(result.matching_target_customer).toEqual(customerA);
    expect(result.matching_score).toBe(0.85);
  });
});