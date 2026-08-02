import { validateDataCompleteness } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-593
  test("[normal] 完全性検証で必須項目の複数個が欠落している場合、不合格と判定される", () => {
    const requiredFields = ["顧客名", "取引金額", "契約日"];
    
    const sales_data = {
      customer_name: null,
      transaction_amount: 1000000,
      contract_date: null,
    };

    const result = validateDataCompleteness(sales_data, requiredFields);

    expect(result.status).toBe("不合格");
    expect(result.missing_fields).toEqual(["顧客名", "契約日"]);
    expect(result.missing_fields).toHaveLength(2);
    expect(result.error_message).toMatch(/必須項目2個/);
    expect(result.error_message).toMatch(/欠落/);
  });
});