import { recordPurchaseResult } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-965
  test("購買結果に関連する提案内容が0件の場合でも記録される", () => {
    const purchase_result_id = "PR-20240115-001";
    const customer_id = "CUST-12345";
    const purchase_amount = 150000;
    const recorded_at = new Date("2024-01-15T11:00:00Z");
    const proposal_items = [];

    const input_data = {
      purchase_result_id,
      customer_id,
      purchase_amount,
      recorded_at,
      proposal_items,
    };

    const result = recordPurchaseResult(input_data);

    expect(result.purchase_result_id).toBe("PR-20240115-001");
    expect(result.customer_id).toBe("CUST-12345");
    expect(result.purchase_amount).toBe(150000);
    expect(result.recorded_at).toEqual(new Date("2024-01-15T11:00:00Z"));
    expect(result.proposal_item_count).toBe(0);
    expect(result.is_recorded).toBe(true);
  });
});