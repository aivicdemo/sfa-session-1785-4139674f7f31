import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-358
  test("正規化ルール適用後の顧客名が一致する場合、重複と判定される", () => {
    const normalizationRules = [
      {
        field: "name",
        rules: [
          { type: "trim_spaces" },
          { type: "uppercase" },
        ],
      },
    ];

    const customerA = {
      id: "001",
      name: "山田  太郎",
    };

    const customerB = {
      id: "002",
      name: "山田太郎",
    };

    const result = detectDuplicateCustomers(
      [customerA, customerB],
      normalizationRules
    );

    expect(result.duplicatePairs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id_1: "001",
          id_2: "002",
          reason: "normalized_name_match",
          similarity: 1.0,
        }),
      ])
    );

    const matchingPair = result.duplicatePairs.find(
      (pair: any) =>
        (pair.id_1 === "001" && pair.id_2 === "002") ||
        (pair.id_1 === "002" && pair.id_2 === "001")
    );

    expect(matchingPair).toBeDefined();
    expect(matchingPair.reason).toBe("normalized_name_match");
    expect(matchingPair.similarity).toBe(1.0);
  });
});