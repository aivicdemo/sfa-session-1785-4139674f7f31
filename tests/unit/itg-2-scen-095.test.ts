import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と統合判定機能", () => {
  // SCEN-095
  test("重複候補が0件の場合、統合処理を実行しない", () => {
    const input_customer_id = "CUST-001";
    const input_customer_name = "山田太郎";

    const result = detectDuplicateCustomers({
      customer_id: input_customer_id,
      customer_name: input_customer_name,
      duplicate_candidate_count: 0,
    });

    expect(result.integration_executed_flag).toBe(false);
    expect(result.integration_target_record_count).toBe(0);
    expect(result.process_log).toMatch(/重複候補が検出されないため統合処理をスキップしました/);
  });
});