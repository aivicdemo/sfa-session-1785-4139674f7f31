import { extractFailurePatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能 - 重複レコード除外と失敗パターン抽出", () => {
  // SCEN-848
  test("行動ログデータに重複レコードが含まれるとき、重複を除外して失敗パターンが抽出される", () => {
    const sales_person_id = "SP001";
    const customer_id = "CUST001";
    const timestamp = "2024-01-15T10:00:00Z";

    const action_logs = [
      {
        sales_person_id: sales_person_id,
        customer_id: customer_id,
        timestamp: timestamp,
        action_type: "商談クローズ試行",
        result: "失敗",
        reason: "顧客から返答なし",
      },
      {
        sales_person_id: sales_person_id,
        customer_id: customer_id,
        timestamp: timestamp,
        action_type: "商談クローズ試行",
        result: "失敗",
        reason: "顧客から返答なし",
      },
      {
        sales_person_id: "SP002",
        customer_id: "CUST002",
        timestamp: "2024-01-15T11:00:00Z",
        action_type: "提案資料送付",
        result: "失敗",
        reason: "送付先メールアドレス無効",
      },
      {
        sales_person_id: "SP001",
        customer_id: "CUST003",
        timestamp: "2024-01-15T12:00:00Z",
        action_type: "初回接触試行",
        result: "失敗",
        reason: "電話番号誤り",
      },
    ];

    const result = extractFailurePatterns(action_logs);

    expect(result.total_records_after_deduplication).toBe(3);
    expect(result.failure_patterns).toHaveLength(3);

    const close_failure = result.failure_patterns.find(
      (pattern) => pattern.pattern_type === "商談クローズ失敗"
    );
    expect(close_failure).toBeDefined();
    expect(close_failure?.record_count).toBe(1);
    expect(close_failure?.affected_sales_persons).toEqual([sales_person_id]);

    const send_failure = result.failure_patterns.find(
      (pattern) => pattern.pattern_type === "提案資料未送付"
    );
    expect(send_failure).toBeDefined();
    expect(send_failure?.record_count).toBe(1);

    const contact_failure = result.failure_patterns.find(
      (pattern) => pattern.pattern_type === "初回接触失敗"
    );
    expect(contact_failure).toBeDefined();
    expect(contact_failure?.record_count).toBe(1);
  });
});