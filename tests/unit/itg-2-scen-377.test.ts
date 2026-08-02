import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-377
  test("提案内容の金額が0の場合、金額漏れとして検出される", () => {
    const proposal_input = {
      proposal_id: "PROP-20240115-001",
      customer_name: "テスト顧客",
      proposal_date: "2024-01-15",
      amount: 0,
      product_name: "商品A",
      quantity: 1,
    };

    const validation_result = validateSalesDataQuality(proposal_input);

    expect(validation_result.has_errors).toBe(true);
    expect(validation_result.error_list.length).toBeGreaterThanOrEqual(1);

    const amount_error = validation_result.error_list.find(
      (err) => err.error_code === "AMOUNT_MISSING"
    );
    expect(amount_error).toBeDefined();
    expect(amount_error?.error_level).toBe("error");
    expect(amount_error?.error_message).toContain("金額漏れ");
  });
});