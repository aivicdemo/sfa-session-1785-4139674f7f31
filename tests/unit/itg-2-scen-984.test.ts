import { normalizeOperationalData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-984
  test("複数の正規化ルールが順序立てて全て適用される", () => {
    const input = {
      category: "営業成績",
      amount: "150000",
      date: "2024/01/15",
      customerName: "  ABC  Corporation  ",
    };

    const normalizationRules = [
      {
        id: "rule-a",
        condition: { field: "category", pattern: "営業成績" },
        transformation: { field: "category", operation: "normalize_category" },
      },
      {
        id: "rule-b",
        condition: { field: "amount", threshold: 100000 },
        transformation: { field: "amount", operation: "convert_to_number" },
      },
      {
        id: "rule-c",
        condition: { field: "date", format: "YYYY/MM/DD" },
        transformation: { field: "date", operation: "standardize_date_format" },
      },
    ];

    const result = normalizeOperationalData({
      inputData: input,
      rules: normalizationRules,
    });

    expect(result.normalized).toEqual({
      category: "営業成績",
      amount: 150000,
      date: "2024-01-15",
      customerName: "ABC Corporation",
    });

    expect(result.appliedRules).toEqual(["rule-a", "rule-b", "rule-c"]);
    expect(result.appliedRules.length).toBe(3);
    expect(result.logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "rule-a", status: "applied" }),
        expect.objectContaining({ ruleId: "rule-b", status: "applied" }),
        expect.objectContaining({ ruleId: "rule-c", status: "applied" }),
      ])
    );
  });
});