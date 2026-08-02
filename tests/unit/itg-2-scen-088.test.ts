import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-088
  test("許容エラー率が5%の場合、エラー率が5.1%で品質判定が失敗する", () => {
    const tolerance_error_rate = 0.05;
    const total_records = 1000;
    const error_count = 51;
    const actual_error_rate = error_count / total_records;

    const valid_records = Array.from({ length: total_records - error_count }, (_, i) => ({
      id: `sales_${i + 1}`,
      customer_name: `Customer ${i + 1}`,
      customer_id: `cust_${i + 1}`,
      contact_date: "2024-01-15",
      proposal_amount: 100000 + i * 1000,
      status: "completed",
    }));

    const error_records = Array.from({ length: error_count }, (_, i) => ({
      id: `sales_error_${i + 1}`,
      customer_name: "",
      customer_id: `cust_error_${i + 1}`,
      contact_date: "2024-01-15",
      proposal_amount: null,
      status: "completed",
    }));

    const test_data = [...valid_records, ...error_records];

    const result = validateSalesDataQuality({
      records: test_data,
      tolerance_error_rate: tolerance_error_rate,
    });

    expect(result.status).toBe("FAILED");
    expect(result.error_rate).toBe(0.051);
    expect(result.error_count).toBe(51);
    expect(result.total_records).toBe(1000);
  });
});