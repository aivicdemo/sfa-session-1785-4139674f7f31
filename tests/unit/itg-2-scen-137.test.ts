import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-137
  test("電話番号が空文字列のレコードは検査対象外に除外される", () => {
    const testDataset = [
      {
        customer_id: "C001",
        customer_name: "株式会社テスト",
        email: "test@example.com",
        phone: "",
      },
      {
        customer_id: "C002",
        customer_name: "株式会社テスト",
        email: "test@example.com",
        phone: "090-1234-5678",
      },
      {
        customer_id: "C003",
        customer_name: "別会社",
        email: "other@example.com",
        phone: "090-9876-5432",
      },
    ];

    const result = detectDuplicateCustomers(testDataset);

    expect(result).toEqual({
      excluded_records: [
        {
          customer_id: "C001",
          customer_name: "株式会社テスト",
          email: "test@example.com",
          phone: "",
          exclusion_reason: "電話番号",
        },
      ],
      inspected_count: 2,
      duplicate_pairs: [
        {
          primary_id: "C002",
          duplicate_id: "C001",
          match_fields: ["customer_name", "email"],
        },
      ],
    });
  });
});