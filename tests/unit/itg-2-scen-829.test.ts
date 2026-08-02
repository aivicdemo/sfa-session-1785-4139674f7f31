import { extractSuccessPatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-829
  test("営業担当者の商談実績データが0件のとき、成功パターン抽出が空結果で返される", () => {
    const sales_person_id = "SP001";
    const deal_records: any[] = [];

    const result = extractSuccessPatterns(sales_person_id, deal_records);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});