import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-133
  test("住所が完全一致する2レコードが重複候補として検出される", () => {
    const recordA = {
      customer_id: "A001",
      customer_name: "田中太郎",
      address: "東京都渋谷区道玄坂1-2-3",
      phone: "090-1234-5678",
    };

    const recordB = {
      customer_id: "B001",
      customer_name: "田中太郎",
      address: "東京都渋谷区道玄坂1-2-3",
      phone: "090-9999-9999",
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      record_id_1: "A001",
      record_id_2: "B001",
      is_duplicate: true,
      reason: "address_exact_match",
    });
  });
});