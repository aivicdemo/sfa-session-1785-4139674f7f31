import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-180
  test("品質検証結果が複数件のとき、エラー重度順に優先度が決定される", () => {
    const validation_results = [
      {
        validation_id: "val_001",
        rule_id: "rule_high_1",
        error_severity: "LOW",
        error_message: "顧客名が空白です",
        detected_at: "2024-01-15T10:00:00Z",
        data_id: "cust_005",
      },
      {
        validation_id: "val_002",
        rule_id: "rule_high_2",
        error_severity: "HIGH",
        error_message: "重複顧客が検出されました",
        detected_at: "2024-01-15T09:45:00Z",
        data_id: "cust_001",
      },
      {
        validation_id: "val_003",
        rule_id: "rule_med_1",
        error_severity: "MEDIUM",
        error_message: "電話番号の形式が不正です",
        detected_at: "2024-01-15T09:30:00Z",
        data_id: "cust_002",
      },
      {
        validation_id: "val_004",
        rule_id: "rule_high_3",
        error_severity: "HIGH",
        error_message: "必須項目の住所が未入力です",
        detected_at: "2024-01-15T09:15:00Z",
        data_id: "cust_003",
      },
      {
        validation_id: "val_005",
        rule_id: "rule_med_2",
        error_severity: "MEDIUM",
        error_message: "メールアドレスが重複しています",
        detected_at: "2024-01-15T09:00:00Z",
        data_id: "cust_004",
      },
    ];

    const sorted_results = validateSalesDataQuality(validation_results);

    expect(sorted_results).toHaveLength(5);

    expect(sorted_results[0].error_severity).toBe("HIGH");
    expect(sorted_results[1].error_severity).toBe("HIGH");
    expect(sorted_results[2].error_severity).toBe("MEDIUM");
    expect(sorted_results[3].error_severity).toBe("MEDIUM");
    expect(sorted_results[4].error_severity).toBe("LOW");

    expect(sorted_results[0].validation_id).toBe("val_002");
    expect(sorted_results[1].validation_id).toBe("val_004");
    expect(sorted_results[2].validation_id).toBe("val_003");
    expect(sorted_results[3].validation_id).toBe("val_005");
    expect(sorted_results[4].validation_id).toBe("val_001");
  });
});