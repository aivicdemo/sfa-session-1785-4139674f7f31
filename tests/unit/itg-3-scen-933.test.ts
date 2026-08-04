import { describe, test, expect, beforeEach } from "@jest/globals";
import { searchCustomerByAttributes } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 顧客情報検索", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-933
  test("営業担当者が顧客情報を入力した場合、顧客マスタから対応する顧客レコードが正常に検索される", async () => {
    const input_customer_name = "株式会社ABC";
    const input_industry = "製造業";
    const input_employee_count = 500;

    const expected_customer_id = "CUST-001";
    const expected_customer_name = "株式会社ABC";
    const expected_industry = "製造業";
    const expected_employee_count = 500;
    const expected_address = "東京都渋谷区1-1-1";
    const expected_phone_number = "03-1234-5678";
    const expected_results_count = 1;
    const max_search_time_ms = 3000;

    const start_time = Date.now();

    const result = await searchCustomerByAttributes({
      customer_name: input_customer_name,
      industry: input_industry,
      employee_count: input_employee_count,
    });

    const elapsed_time = Date.now() - start_time;

    expect(result).toBeDefined();
    expect(result.matches).toHaveLength(expected_results_count);
    expect(result.matches[0]).toEqual({
      customer_id: expected_customer_id,
      customer_name: expected_customer_name,
      industry: expected_industry,
      employee_count: expected_employee_count,
      address: expected_address,
      phone_number: expected_phone_number,
    });
    expect(elapsed_time).toBeLessThanOrEqual(max_search_time_ms);
  });
});