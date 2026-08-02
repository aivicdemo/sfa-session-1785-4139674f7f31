import { detectDuplicateAndNormalizeCustomer } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-808: [normal] 顧客データ重複・不整合検出機能 - 正規化ルール「前後の空白削除」が適用され、スペースが除外される", () => {
    const input_customer_name = "  山田太郎  ";

    const result = detectDuplicateAndNormalizeCustomer({
      customer_name: input_customer_name,
      normalization_rule_trim_enabled: true,
    });

    expect(result.normalized_customer_name).toBe("山田太郎");
    expect(result.normalization_applied).toBe(true);
  });
});