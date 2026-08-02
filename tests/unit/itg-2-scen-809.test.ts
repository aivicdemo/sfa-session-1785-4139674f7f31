import { applyNormalizationRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-809
  test("正規化ルール「住所の都道府県形式統一」が適用され、住所表記が統一される", () => {
    const input_records = [
      {
        customer_id: "cust_001",
        address: "東京都渋谷区道玄坂1-2-3",
      },
      {
        customer_id: "cust_002",
        address: "東京渋谷区道玄坂1-2-3",
      },
      {
        customer_id: "cust_003",
        address: "東京都 渋谷区 道玄坂1-2-3",
      },
      {
        customer_id: "cust_004",
        address: "東京都渋谷区 道玄坂1-2-3",
      },
    ];

    const result = applyNormalizationRule(input_records, "address_prefecture_unification");

    const expected_normalized_address = "東京都渋谷区道玄坂1-2-3";

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({
      customer_id: "cust_001",
      address: expected_normalized_address,
    });
    expect(result[1]).toEqual({
      customer_id: "cust_002",
      address: expected_normalized_address,
    });
    expect(result[2]).toEqual({
      customer_id: "cust_003",
      address: expected_normalized_address,
    });
    expect(result[3]).toEqual({
      customer_id: "cust_004",
      address: expected_normalized_address,
    });

    result.forEach((record) => {
      expect(record.address).toBe(expected_normalized_address);
    });
  });
});