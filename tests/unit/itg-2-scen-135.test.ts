import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-135
  test("顧客名が空文字列のレコードは検査対象外に除外される", () => {
    const testDataset = [
      {
        customer_id: "CUST-001",
        customer_name: "株式会社ABC",
        address: "東京都渋谷区",
        phone: "03-1234-5678",
      },
      {
        customer_id: "CUST-002",
        customer_name: "",
        address: "東京都新宿区",
        phone: "03-8765-4321",
      },
      {
        customer_id: "CUST-003",
        customer_name: "株式会社XYZ",
        address: "大阪府大阪市",
        phone: "06-1111-2222",
      },
    ];

    const result = detectDuplicateCustomers(testDataset);

    expect(result.inspection_target_count).toBe(2);
    expect(result.excluded_records).toHaveLength(1);
    expect(result.excluded_records[0]).toEqual({
      customer_id: "CUST-002",
      exclusion_reason: "顧客名が空文字列",
    });
  });
});