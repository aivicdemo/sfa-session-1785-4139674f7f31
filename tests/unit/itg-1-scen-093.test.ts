import { validateLearningDataQuality } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-093
  test("学習データ品質検証が失敗する - 顧客データの必須フィールド欠落時", () => {
    const learning_data_set = {
      customer_records: [
        { customer_id: "C001", customer_name: "顧客A", email: "a@example.com" },
        { customer_id: "C002", customer_name: "顧客B", email: "b@example.com" },
        { customer_id: "C003", customer_name: "顧客C", email: "c@example.com" },
        { customer_id: "C004", customer_name: "顧客D", email: "d@example.com" },
        { customer_id: "C005", customer_name: "顧客E", email: "e@example.com" },
        { customer_id: "C006", customer_name: null, email: "f@example.com" },
        { customer_id: "C007", customer_name: null, email: "g@example.com" },
        { customer_id: "C008", customer_name: null, email: "h@example.com" },
        { customer_id: "C009", customer_name: "顧客I", email: "i@example.com" },
        { customer_id: "C010", customer_name: "顧客J", email: "j@example.com" },
      ],
      total_record_count: 10,
    };

    const result = validateLearningDataQuality(learning_data_set);

    expect(result.validation_status).toBe("FAILED");
    expect(result.error_code).toBe("DATA_QUALITY_VALIDATION_ERROR");
    expect(result.error_message).toMatch(/必須フィールド「顧客名」が3件欠落/);
    expect(result.inference_execution_blocked).toBe(true);
  });
});