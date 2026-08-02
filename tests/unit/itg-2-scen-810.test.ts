import { applyNormalizationRule } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-810
  test("電話番号のハイフン除外ルールを適用してハイフンを削除する", () => {
    const input_phone_number = "090-1234-5678";
    const normalization_rule_type = "phone_number_hyphen_removal";

    const result = applyNormalizationRule(input_phone_number, normalization_rule_type);

    expect(result).toBe("09012345678");
  });
});