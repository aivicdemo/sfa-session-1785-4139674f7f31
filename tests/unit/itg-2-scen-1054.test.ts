import { detectDuplicateAndNormalize } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  // SCEN-1054
  test("同じ顧客データの重複判定を2回実行した場合に同じ結果が得られる", () => {
    const customer_data = {
      customer_id: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "09012345678",
    };

    const result1 = detectDuplicateAndNormalize(customer_data);
    const result2 = detectDuplicateAndNormalize(customer_data);

    expect(result1.match_score).toBe(result2.match_score);
    expect(result1.is_duplicate).toBe(result2.is_duplicate);
    expect(result1.duplicate_records).toEqual(result2.duplicate_records);
    expect(result1.normalized_customer).toEqual(result2.normalized_customer);
  });
});