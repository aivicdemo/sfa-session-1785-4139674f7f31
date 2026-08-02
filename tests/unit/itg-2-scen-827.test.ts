import { integrateCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出と統合判定", () => {
  // SCEN-827
  test("統合判定結果が「統合不可」の場合、統合履歴に「判定却下」が記録される", () => {
    const customer_pair_id = "CUST-001_CUST-002";
    const first_customer_id = "CUST-001";
    const second_customer_id = "CUST-002";
    const judgment_status = "判定却下";
    const judgment_reason = "統合不可";
    const current_time = new Date("2024-01-15T11:00:00Z");

    const input_payload = {
      customer_pair_id: customer_pair_id,
      first_customer_id: first_customer_id,
      second_customer_id: second_customer_id,
      integration_judgment_result: "統合不可",
      judgment_timestamp: current_time,
    };

    const result = integrateCustomerDuplicates(input_payload);

    expect(result.customer_pair_id).toBe(customer_pair_id);
    expect(result.judgment_status).toBe(judgment_status);
    expect(result.judgment_reason).toBe(judgment_reason);

    const result_timestamp = new Date(result.recorded_timestamp);
    const time_diff_seconds =
      (result_timestamp.getTime() - current_time.getTime()) / 1000;
    expect(Math.abs(time_diff_seconds)).toBeLessThanOrEqual(5);
  });
});