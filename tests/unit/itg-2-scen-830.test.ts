import { extractSuccessPatterns } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  // SCEN-830
  test("営業担当者の商談実績データが1件のとき、成功パターン抽出が1件の結果で返される", () => {
    const sales_person_id = "SP001";
    const deal_records = [
      {
        sales_person_id: "SP001",
        deal_name: "A社提案",
        amount: 1000000,
        status: "成功",
        deal_date: "2024-01-15T10:00:00Z",
      },
    ];

    const result = extractSuccessPatterns(sales_person_id, deal_records);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      sales_person_id: "SP001",
      deal_name: "A社提案",
      amount: 1000000,
      status: "成功",
      deal_date: "2024-01-15T10:00:00Z",
    });
  });
});