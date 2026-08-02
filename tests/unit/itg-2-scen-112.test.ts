import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-112
  test("正規化ルール適用順序が異なる場合でも最終的な正規化結果は同じである", () => {
    const input_customer_name = " Taro Yamada-Tanaka ";

    const result_pattern_a = normalizeCustomerData(input_customer_name, [
      "uppercase",
      "remove_whitespace",
      "remove_symbols"
    ]);

    const result_pattern_b = normalizeCustomerData(input_customer_name, [
      "remove_symbols",
      "remove_whitespace",
      "uppercase"
    ]);

    const result_pattern_c = normalizeCustomerData(input_customer_name, [
      "remove_whitespace",
      "remove_symbols",
      "uppercase"
    ]);

    const expected_result = "TAROYAMADATANAKA";

    expect(result_pattern_a).toBe(expected_result);
    expect(result_pattern_b).toBe(expected_result);
    expect(result_pattern_c).toBe(expected_result);
  });
});