import { integrateAndNormalizePurchaseData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-983
  test("正規化ルールが1件適用される場合に正しく正規化される", () => {
    const normalizationRules = [
      {
        rule_id: "rule_001",
        target_field: "product_name",
        source_value: "ノートPC",
        target_value: "notebook pc",
        rule_type: "standardization",
        is_active: true,
      },
    ];

    const purchaseRecords = [
      {
        record_id: "rec_001",
        customer_id: "cust_001",
        product_name: "ノートPC",
        quantity: 5,
        purchase_amount: 50000,
        purchase_date: "2024-01-15",
        contact_frequency: 3,
      },
    ];

    const result = integrateAndNormalizePurchaseData(
      purchaseRecords,
      normalizationRules
    );

    expect(result).toEqual({
      integrated_records: [
        {
          record_id: "rec_001",
          customer_id: "cust_001",
          product_name: "notebook pc",
          quantity: 5,
          purchase_amount: 50000,
          purchase_date: "2024-01-15",
          contact_frequency: 3,
          normalization_applied: true,
          applied_rules: ["rule_001"],
        },
      ],
      normalization_summary: {
        total_records_processed: 1,
        records_normalized: 1,
        rules_applied: 1,
        processing_status: "success",
      },
    });
  });
});