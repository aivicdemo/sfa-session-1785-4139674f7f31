import { validateCustomerDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-368
  test("顧客情報が0件の場合、空の検証結果リストが返される", () => {
    const emptyCustomerList: any[] = [];
    const result = validateCustomerDataQuality(emptyCustomerList);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});