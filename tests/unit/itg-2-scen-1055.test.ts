import { detectCustomerDataInconsistencies } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  // SCEN-1055
  test("顧客データの不整合がデータ不整合ログに記録される", () => {
    const input_customer_id = "C001";
    const input_customer_name = "山田太郎";
    const input_phone = "090-1234-5678";
    const input_email = "yamada@example.co.jp";
    const input_registered_address = "東京都渋谷区";
    const input_billing_address = "神奈川県横浜市";
    const input_last_updated_at = "2024-01-15T10:30:00Z";
    const input_previous_updated_at = "2024-01-20T15:45:00Z";

    const result = detectCustomerDataInconsistencies({
      customer_id: input_customer_id,
      customer_name: input_customer_name,
      phone: input_phone,
      email: input_email,
      registered_address: input_registered_address,
      billing_address: input_billing_address,
      last_updated_at: input_last_updated_at,
      previous_updated_at: input_previous_updated_at,
    });

    expect(result.inconsistency_logs).toHaveLength(2);

    const timeline_log = result.inconsistency_logs.find(
      (log) => log.inconsistency_category === "時系列矛盾"
    );
    expect(timeline_log).toBeDefined();
    expect(timeline_log?.customer_id).toBe(input_customer_id);
    expect(timeline_log?.inconsistency_content).toBe(
      "最終更新日時(2024-01-15T10:30:00Z)が前回更新日時(2024-01-20T15:45:00Z)より過去である"
    );
    expect(timeline_log?.detected_timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    const address_log = result.inconsistency_logs.find(
      (log) => log.inconsistency_category === "住所不整合"
    );
    expect(address_log).toBeDefined();
    expect(address_log?.customer_id).toBe(input_customer_id);
    expect(address_log?.inconsistency_content).toBe(
      "登録住所と請求先住所が相違している"
    );
    expect(address_log?.detected_timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
  });
});