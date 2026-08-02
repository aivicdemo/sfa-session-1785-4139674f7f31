import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-087
  test("許容エラー率が5%の場合、エラー率が4.9%で品質判定が合格する", () => {
    const total_data_count = 1000;
    const error_count = 49;
    const error_rate = (error_count / total_data_count) * 100;
    const tolerance_error_rate = 5;

    const test_dataset = Array.from({ length: total_data_count }, (_, index) => ({
      record_id: `record_${index + 1}`,
      customer_name: index < error_count ? "" : `Customer ${index + 1}`,
      customer_email:
        index < error_count ? "invalid_email" : `customer${index + 1}@example.com`,
      transaction_amount: index < error_count ? -1 : 1000 + index,
      transaction_date:
        index < error_count ? "invalid_date" : "2024-01-15",
      sales_representative: index < error_count ? "" : `Rep ${index + 1}`,
    }));

    const result = validateSalesDataQuality({
      data_records: test_dataset,
      tolerance_error_rate_percent: tolerance_error_rate,
    });

    expect(result.judgment_status).toBe("合格");
    expect(result.error_rate_percent).toBe(4.9);
    expect(result.error_count).toBe(49);
    expect(result.total_record_count).toBe(1000);
  });
});