import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1118
  test("事例データの数値フィールドが整数である場合、形式検証に合格する", () => {
    const test_case_data = {
      sales_amount: 150000,
      customer_id: 12345,
      product_quantity: 50,
      record_id: "REC001",
      transaction_date: "2024-01-15",
    };

    const validation_result = validateSalesDataQuality(test_case_data);

    expect(validation_result.status).toBe("合格");
    expect(validation_result.format_checks).toEqual({
      sales_amount: "整数形式チェック：OK",
      customer_id: "整数形式チェック：OK",
      product_quantity: "整数形式チェック：OK",
    });
    expect(validation_result.all_fields_valid).toBe(true);
  });
});