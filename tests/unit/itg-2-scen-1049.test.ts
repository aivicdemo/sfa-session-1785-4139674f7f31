import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  // SCEN-1049
  test("相似度が閾値の直下（0.84）である場合に重複と判定されない", () => {
    const similarity_threshold = 0.85;
    const actual_similarity = 0.84;

    const existing_customer = {
      id: "cust_001",
      name: "山田太郎",
      address: "東京都渋谷区1-2-3",
      phone: "090-1234-5678",
    };

    const new_customer = {
      name: "山田太郎",
      address: "東京都渋谷区1-2-3",
      phone: "090-1234-5679",
    };

    const result = detectDuplicateCustomers(
      [existing_customer],
      new_customer,
      similarity_threshold,
      actual_similarity
    );

    expect(result.is_duplicate).toBe(false);
    expect(result.should_register_as_new).toBe(true);
    expect(result.duplicate_candidates).toEqual([]);
  });
});