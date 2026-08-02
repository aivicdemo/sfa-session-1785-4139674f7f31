import { describe, test, expect } from "@jest/globals";
import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-081
  test("should detect missing required fields (customer name and sales amount)", () => {
    const testData = {
      customer_name: null,
      sales_amount: "",
      transaction_date: "2024-01-15",
      product_code: "PROD001"
    };

    const result = validateSalesDataQuality(testData);

    expect(result.validation_status).toBe("NG");
    expect(result.missing_fields).toEqual(["顧客名", "売上金額"]);
    expect(result.error_code).toBe("ERR_MISSING_REQUIRED_FIELDS");
    expect(result.error_message).toBe(
      '必須項目「顧客名」「売上金額」が入力されていません'
    );
  });
});