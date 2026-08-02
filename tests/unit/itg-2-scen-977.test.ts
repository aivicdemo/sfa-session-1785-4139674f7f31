import { judgeCustomerMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-977
  test("購買結果記録・営業データ統合機能 - 顧客の重複候補が1件存在する場合に統合判定が考慮される", () => {
    const existing_customer = {
      customer_id: "C001",
      customer_name: "山田太郎",
      email: "yamada@example.com",
    };

    const new_purchase_data = {
      customer_name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
    };

    const duplicate_candidates = [
      {
        existing_customer_id: "C001",
        match_score: 0.95,
      },
    ];

    const result = judgeCustomerMerge({
      new_purchase_data,
      duplicate_candidates,
    });

    expect(result.should_merge).toBe(true);
    expect(result.merge_target_customer_id).toBe("C001");
    expect(result.merge_score).toBeGreaterThanOrEqual(0.95);
    expect(result.merge_reason).toMatch(/メール|顧客名|一致/);
  });
});