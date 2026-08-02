import { validateRequiredFields } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-080
  test("入力漏れ検出：必須項目が欠けているデータを検出する", () => {
    const salesData = {
      customerName: "",
      productId: "PROD001",
      transactionAmount: 150000,
      transactionDate: "2024-01-15",
    };

    const result = validateRequiredFields(salesData);

    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain("顧客名");
    expect(result.errorMessage).toBe("必須項目 顧客名 が入力されていません");
  });
});