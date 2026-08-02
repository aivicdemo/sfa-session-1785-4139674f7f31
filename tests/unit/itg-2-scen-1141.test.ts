import { applyNormalizationRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1141
  test("適用される正規化ルールが複数存在する場合、すべてのルールが順序通り適用される", () => {
    const normalizationRules = [
      {
        ruleId: "rule_001",
        ruleOrder: 1,
        ruleName: "姓名の前後空白を削除",
        targetField: "name",
        normalizationType: "trim",
      },
      {
        ruleId: "rule_002",
        ruleOrder: 2,
        ruleName: "カナ氏名をひらがなに統一",
        targetField: "kanaName",
        normalizationType: "katakana_to_hiragana",
      },
      {
        ruleId: "rule_003",
        ruleOrder: 3,
        ruleName: "電話番号からハイフンを削除",
        targetField: "phone",
        normalizationType: "remove_hyphen",
      },
    ];

    const customerData = {
      name: "  山田  太郎  ",
      kanaName: "ヤマダ タロウ",
      phone: "090-1234-5678",
    };

    const result = applyNormalizationRules(customerData, normalizationRules);

    expect(result.name).toBe("山田太郎");
    expect(result.kanaName).toBe("やまだ たろう");
    expect(result.phone).toBe("09012345678");
  });
});