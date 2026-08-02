import { detectDuplicateAndNormalize } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データ重複・不整合検出と正規化ルール適用", () => {
  // SCEN-367
  test("複数の正規化ルールが同一項目に適用可能な場合、優先度の最も高いルールが採用される", () => {
    const normalizationRules = [
      {
        ruleId: "rule_1",
        targetField: "phoneNumber",
        priority: 10,
        ruleType: "removeSymbol",
        pattern: /[-]/g,
        replacement: "",
      },
      {
        ruleId: "rule_2",
        targetField: "phoneNumber",
        priority: 5,
        ruleType: "replaceSymbol",
        pattern: /-/g,
        replacement: " ",
      },
      {
        ruleId: "rule_3",
        targetField: "phoneNumber",
        priority: 15,
        ruleType: "replacePrefix",
        pattern: /^0/,
        replacement: "+81",
      },
    ];

    const customerData = {
      customerId: "CUST_001",
      phoneNumber: "090-1234-5678",
    };

    const result = detectDuplicateAndNormalize({
      customerData,
      normalizationRules,
    });

    expect(result.normalizedPhoneNumber).toBe("+8190-1234-5678");
    expect(result.appliedRuleId).toBe("rule_3");
    expect(result.appliedRulePriority).toBe(15);
  });
});