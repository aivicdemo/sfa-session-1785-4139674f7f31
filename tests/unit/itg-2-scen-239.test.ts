import { convertProcessSpecToSystemRequirement } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-239
  test("データ項目が欠けているとき、要件仕様変換処理がエラーになる", () => {
    const sales_data_missing_customer_id = {
      transaction_id: "TXN20240115001",
      transaction_date: "2024-01-15T11:00:00Z",
      product_name: "営業支援システム",
      amount: 500000,
    };

    expect(() =>
      convertProcessSpecToSystemRequirement(sales_data_missing_customer_id)
    ).toThrow(/顧客ID/);
  });
});