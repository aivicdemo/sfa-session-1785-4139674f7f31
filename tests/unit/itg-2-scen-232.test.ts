import { transformRequirementSpecification } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-232
  test("判定基準が1件のとき、判定基準の要件仕様が正常に変換される", () => {
    const input_criteria = [
      {
        rule_id: "RULE-001",
        requirement_spec: "sales_amount >= 100000",
      },
    ];

    const result = transformRequirementSpecification(input_criteria);

    expect(result).toEqual([
      {
        rule_id: "RULE-001",
        transformed_spec: {
          field: "sales_amount",
          operator: ">=",
          value: 100000,
        },
      },
    ]);
    expect(result[0].transformed_spec).not.toBeNull();
    expect(result[0].transformed_spec).not.toBeUndefined();
  });
});