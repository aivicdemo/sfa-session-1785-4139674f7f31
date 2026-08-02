import { detectDeviationPattern } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 乖離パターン検出", () => {
  // SCEN-308
  test("乖離パターン定義マスタが1件のとき、その定義に基づくパターン検出が実行される", () => {
    const pattern_definition = {
      pattern_id: "PATTERN_001",
      detection_condition: "売上予測値と実績値の差が30%以上",
      importance: "高",
    };

    const sales_data = {
      product_name: "商品A",
      forecast_sales: 1000000,
      actual_sales: 650000,
    };

    const result = detectDeviationPattern(pattern_definition, sales_data);

    const expected_deviation_rate = 35;

    expect(result).toEqual({
      pattern_id: "PATTERN_001",
      product_name: "商品A",
      deviation_rate: expected_deviation_rate,
      importance: "高",
      detection_status: "検出",
    });
  });
});