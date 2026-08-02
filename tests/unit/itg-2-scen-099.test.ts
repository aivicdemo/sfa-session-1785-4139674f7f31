import {
  detectDuplicateCustomers,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と統合判定機能", () => {
  test("SCEN-099: 顧客名が部分的に一致する場合、中確度の重複と判定される", () => {
    const recordA = {
      customer_id: "CUST-001",
      customer_name: "株式会社テクノロジー",
      address: "東京都渋谷区",
      phone_number: "03-1234-5678",
    };

    const recordB = {
      customer_id: "CUST-002",
      customer_name: "テクノロジー株式会社",
      address: "東京都渋谷区",
      phone_number: "03-1234-5678",
    };

    const result = detectDuplicateCustomers(recordA, recordB);

    expect(result.confidence).toBe("medium");
    expect(result.reason).toContain("顧客名が部分的に一致");
    expect(result.reason).toContain("株式会社テクノロジー");
    expect(result.reason).toContain("テクノロジー株式会社");
    expect(result.reason).toContain("語順が異なる");
    expect(result.reason).toContain("住所");
    expect(result.reason).toContain("電話番号");
    expect(result.reason).toContain("完全一致");
  });
});