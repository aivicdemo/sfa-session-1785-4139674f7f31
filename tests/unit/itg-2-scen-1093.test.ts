import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1093
  test("重複判定スコアが閾値を超えるとき、重複と判定される", () => {
    const customer_a = {
      id: "CUST001",
      name: "山田太郎",
      email: "yamada@example.com",
    };

    const customer_b = {
      id: "CUST002",
      name: "山田太郎",
      email: "yamada.taro@example.com",
    };

    const duplicate_threshold = 85;

    const result = detectDuplicateCustomers(
      customer_a,
      customer_b,
      duplicate_threshold
    );

    expect(result.score).toBe(87);
    expect(result.isDuplicate).toBe(true);
    expect(result.mergeStatus).toBe("pending_consolidation");
    expect(result.mergeTarget).toEqual({
      primary_customer_id: "CUST001",
      secondary_customer_id: "CUST002",
      consolidation_reason: "name_and_email_similarity_exceeds_threshold",
    });
  });
});