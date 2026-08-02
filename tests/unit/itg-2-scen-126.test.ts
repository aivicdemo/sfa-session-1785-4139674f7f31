import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-126
  test("検査対象の顧客レコードが0件のとき、重複候補が返されない", () => {
    const customers: any[] = [];

    const result = detectDuplicateCustomers(customers);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});