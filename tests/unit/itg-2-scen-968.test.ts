import { recordPurchaseAndIntegrateSalesData } from "../../src/logic/it-1-br-2-2-1-1";

describe("購買結果記録・営業データ統合機能", () => {
  test("SCEN-968: 購買結果に関連する商談記録が0件の場合でも記録される", async () => {
    const purchase_id = "PUR-20240115-001";
    const purchase_datetime = new Date("2024-01-15T11:00:00Z");
    const purchase_amount = 500000;
    const related_negotiation_records = 0;

    const input_data = {
      purchase_id,
      purchase_datetime,
      purchase_amount,
      negotiation_record_ids: [],
    };

    const result = await recordPurchaseAndIntegrateSalesData(input_data);

    expect(result.purchase_record_created).toBe(true);
    expect(result.purchase_id).toBe(purchase_id);
    expect(result.purchase_datetime).toEqual(purchase_datetime);
    expect(result.purchase_amount).toBe(purchase_amount);
    expect(result.related_negotiation_count).toBe(related_negotiation_records);
    expect(result.integration_status).toBe("完了");
    expect(result.integration_log_recorded).toBe(true);
  });
});