import { recordPurchaseDecisionAndIntegrate } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-992
  test("購買結果記録・営業データ統合機能 - 統合判定履歴が1件の場合に正しく履歴化される", () => {
    const purchase_id = "PO-001";
    const amount = 150000;
    const purchase_date = "2024-01-15";
    const now_timestamp = new Date("2024-01-15T10:30:00Z").getTime();

    const result = recordPurchaseDecisionAndIntegrate({
      purchase_id,
      amount,
      purchase_date,
      current_timestamp_ms: now_timestamp,
    });

    expect(result.history_record_count).toBe(1);
    expect(result.latest_history.purchase_id).toBe("PO-001");
    expect(result.latest_history.integration_status).toBe("統合完了");
    expect(result.latest_history.sequence_number).toBe(1);
    expect(result.latest_history.recorded_amount).toBe(150000);
    expect(result.latest_history.recorded_date).toBe("2024-01-15");
    expect(result.latest_history.integrated_at_ms).toBe(now_timestamp);
  });
});