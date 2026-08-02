import { detectDuplicateCustomersAndExecuteIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-241
  test("[normal] 顧客データ重複検出機能 - 重複候補が1件のとき、統合判定が正常に実行される", () => {
    const duplicate_candidate_1 = {
      duplicate_candidate_id: "dup_001",
      customer_id_primary: "cust_A",
      customer_id_secondary: "cust_A_prime",
      customer_name_primary: "顧客A",
      customer_name_secondary: "顧客A'",
      match_score: 0.95,
      match_reason: "顧客名と住所が一致",
      detection_timestamp: new Date("2024-01-15T10:00:00Z"),
      detection_rule_id: "rule_name_address_match",
      status: "pending",
    };

    const input_candidates = [duplicate_candidate_1];

    const result = detectDuplicateCustomersAndExecuteIntegration(input_candidates);

    expect(result.processing_status).toBe("completed");
    expect(["integration_target", "not_integration_target"]).toContain(
      result.integration_judgment_result
    );
    expect(result.processing_log).toContain(
      "重複候補1件に対する統合判定が正常終了"
    );
    expect(Array.isArray(result.processing_log)).toBe(true);
    expect(result.processing_log.length).toBeGreaterThan(0);
  });
});