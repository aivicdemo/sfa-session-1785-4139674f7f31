import { detectDuplicateAndMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1140
  test("重複候補が検出された場合、統合判定履歴が記録される", () => {
    const customer_a = {
      customer_id: "C001",
      company_name: "株式会社テスト",
      phone_number: "090-1234-5678",
      created_at: "2024-01-15T09:00:00Z",
    };

    const customer_b = {
      customer_id: "C002",
      company_name: "株式会社テスト",
      phone_number: "090-1234-5678",
      created_at: "2024-01-15T10:00:00Z",
    };

    const merge_request = {
      source_customer_id: "C001",
      target_customer_id: "C002",
      representative_customer_id: "C001",
      user_id: "USER_TEST_001",
      executed_at: "2024-01-15T11:00:00Z",
    };

    const result = detectDuplicateAndMerge(
      customer_a,
      customer_b,
      merge_request
    );

    expect(result.merge_status).toBe("completed");
    expect(result.representative_customer_id).toBe("C001");
    expect(result.merge_history.source_customer_id).toBe("C001");
    expect(result.merge_history.target_customer_id).toBe("C002");
    expect(result.merge_history.judgment_result).toBe("統合");
    expect(result.merge_history.user_id).toBe("USER_TEST_001");
    expect(result.merge_history.judgment_status).toBe("完了");
    expect(result.merge_history.timestamp).toMatch(/2024-01-15T11:00:00/);
  });
});