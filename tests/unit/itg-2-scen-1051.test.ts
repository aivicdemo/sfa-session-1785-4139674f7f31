import { mergeCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 統合判定機能", () => {
  // SCEN-1051
  test("統合判定結果が承認待ち状態の場合に統合処理が保留される", () => {
    const duplicate_candidates = [
      {
        customer_id: "CUST_001",
        customer_name: "株式会社ABC",
        phone: "03-1234-5678",
        email: "contact@abc.jp",
        merge_status: "unprocessed",
      },
      {
        customer_id: "CUST_002",
        customer_name: "ABC株式会社",
        phone: "03-1234-5678",
        email: "contact@abc.jp",
        merge_status: "unprocessed",
      },
    ];

    const integration_judgment_result = {
      judgment_id: "JUD_20240115_001",
      candidate_group_id: "DUP_001",
      judgment_status: "approval_pending",
      confidence_score: 0.92,
      primary_customer_id: "CUST_001",
      merge_targets: ["CUST_002"],
      recommended_action: "merge",
      created_at: new Date("2024-01-15T10:00:00Z"),
    };

    const result = mergeCustomerDuplicates({
      duplicate_candidates,
      integration_judgment_result,
    });

    expect(result.merge_executed).toBe(false);
    expect(result.status_message).toMatch(/承認待ち/);
    expect(result.customer_merge_states).toEqual([
      {
        customer_id: "CUST_001",
        merge_status: "unprocessed",
      },
      {
        customer_id: "CUST_002",
        merge_status: "unprocessed",
      },
    ]);
  });
});