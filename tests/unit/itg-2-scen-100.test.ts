import { detectDuplicateAndMergeCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-100: 顧客名が一致しない場合、重複ではないと判定される", () => {
    const record_a = {
      customer_id: "CUST001",
      customer_name: "山田太郎",
      address: "東京都渋谷区",
    };

    const record_b = {
      customer_id: "CUST002",
      customer_name: "山田花子",
      address: "東京都渋谷区",
    };

    const merge_result = detectDuplicateAndMergeCustomers(record_a, record_b);

    expect(merge_result.is_duplicate).toBe(false);
    expect(merge_result.merge_reason).toMatch(/顧客名が不一致のため重複対象外/);
  });
});