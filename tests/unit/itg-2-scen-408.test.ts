import { validateSalesData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-408
  test("同一入力で2回実行した場合、同じ検証結果が返される", () => {
    const test_sales_data = {
      customer_name: "山田太郎",
      sales_amount: 150000,
      transaction_date: "2024-01-15",
    };

    const result_first = validateSalesData(test_sales_data);
    const result_second = validateSalesData(test_sales_data);

    expect(result_first.error_codes).toEqual(result_second.error_codes);
    expect(result_first.warning_flag).toBe(result_second.warning_flag);
    expect(result_first.validation_score).toBe(result_second.validation_score);
    expect(result_first.customer_name).toBe(result_second.customer_name);
    expect(result_first.sales_amount).toBe(result_second.sales_amount);
    expect(result_first.transaction_date).toBe(result_second.transaction_date);
    expect(result_first.is_valid).toBe(result_second.is_valid);
  });
});