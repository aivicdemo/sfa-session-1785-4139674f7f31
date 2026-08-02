import { detectDuplicateAndInconsistency } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-363
  test("データ品質ルールが欠けている場合、検証がスキップされる", () => {
    const customerData = {
      customerId: "C001",
      customerName: "株式会社テスト",
      phoneNumber: "090-1234-567",
      email: "test@example.com",
      address: "東京都渋谷区",
    };

    const qualityRulesWithMissingPhoneRule = {
      emailFormatCheck: {
        ruleId: "RULE_EMAIL_001",
        ruleName: "メールアドレス形式チェック",
        enabled: true,
        validationRegex: "^[^@]+@[^@]+\\.[^@]+$",
      },
      addressLengthCheck: {
        ruleId: "RULE_ADDR_001",
        ruleName: "住所文字数チェック",
        enabled: true,
        minLength: 5,
        maxLength: 100,
      },
    };

    const result = detectDuplicateAndInconsistency(
      customerData,
      qualityRulesWithMissingPhoneRule
    );

    expect(result.validationResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: "RULE_EMAIL_001",
          ruleName: "メールアドレス形式チェック",
          status: "executed",
          passed: true,
        }),
        expect.objectContaining({
          ruleId: "RULE_ADDR_001",
          ruleName: "住所文字数チェック",
          status: "executed",
          passed: true,
        }),
      ])
    );

    const phoneCheckResult = result.validationResults.find(
      (r: { ruleId: string }) => r.ruleId === "RULE_PHONE_001"
    );
    expect(phoneCheckResult).toBeUndefined();

    expect(result.skippedRules).toContain("RULE_PHONE_001");
    expect(result.processStatus).toBe("completed_with_skipped_rules");
    expect(result.overallQualityScore).toBeGreaterThanOrEqual(0);
    expect(result.overallQualityScore).toBeLessThanOrEqual(100);
  });
});