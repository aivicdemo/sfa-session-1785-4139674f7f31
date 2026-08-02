import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 重複候補検出", () => {
  // SCEN-1039
  test("比較対象が1件のみの場合、重複候補は0件で検出されない", () => {
    const customers = [
      {
        customer_id: "C001",
        customer_name: "山田太郎",
        email: "yamada@example.com",
      },
    ];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicate_candidates).toEqual([]);
    expect(result.candidate_count).toBe(0);
    expect(result.display_message).toBe("重複候補なし");
    expect(result.duplicate_flag).toBe(false);
    expect(result.system_log).toMatch(/比較対象データが1件以下のため重複検出をスキップしました/);
  });
});