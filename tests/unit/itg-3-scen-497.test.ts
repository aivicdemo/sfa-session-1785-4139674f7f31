import { calculateImprovementTargets } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善対象項目算出機能", () => {
  test("SCEN-497: ルール違反の重要度区分が定義済み値以外のとき、エラーが発生する", () => {
    const invalidRuleViolation = {
      ruleId: "RULE-001",
      severityLevel: "INVALID_LEVEL",
      violationDescription: "Invalid severity level test",
      affectedField: "customer_name",
      suggestedAction: "Review and correct the field",
    };

    const error = expect(() =>
      calculateImprovementTargets([invalidRuleViolation])
    ).toThrow(/重要度区分/);

    try {
      calculateImprovementTargets([invalidRuleViolation]);
    } catch (e: unknown) {
      const thrownError = e as {
        code?: string;
        message?: string;
        statusCode?: number;
      };
      expect(thrownError.code).toBe("INVALID_SEVERITY_LEVEL");
      expect(thrownError.statusCode).toBe(400);
      expect(thrownError.message).toMatch(/ルール違反の重要度区分が定義済み値/);
    }
  });

  test("SCEN-497: severityLevel が null のとき、エラーが発生する", () => {
    const invalidRuleViolation = {
      ruleId: "RULE-002",
      severityLevel: null,
      violationDescription: "Null severity level test",
      affectedField: "customer_email",
      suggestedAction: "Validate email format",
    };

    expect(() => calculateImprovementTargets([invalidRuleViolation])).toThrow(
      /重要度区分/
    );

    try {
      calculateImprovementTargets([invalidRuleViolation]);
    } catch (e: unknown) {
      const thrownError = e as {
        code?: string;
        statusCode?: number;
      };
      expect(thrownError.code).toBe("INVALID_SEVERITY_LEVEL");
      expect(thrownError.statusCode).toBe(400);
    }
  });

  test("SCEN-497: severityLevel が undefined のとき、エラーが発生する", () => {
    const invalidRuleViolation = {
      ruleId: "RULE-003",
      severityLevel: undefined,
      violationDescription: "Undefined severity level test",
      affectedField: "customer_phone",
      suggestedAction: "Add phone validation",
    };

    expect(() => calculateImprovementTargets([invalidRuleViolation])).toThrow(
      /重要度区分/
    );

    try {
      calculateImprovementTargets([invalidRuleViolation]);
    } catch (e: unknown) {
      const thrownError = e as {
        code?: string;
        statusCode?: number;
      };
      expect(thrownError.code).toBe("INVALID_SEVERITY_LEVEL");
      expect(thrownError.statusCode).toBe(400);
    }
  });

  test("SCEN-497: severityLevel が空文字列のとき、エラーが発生する", () => {
    const invalidRuleViolation = {
      ruleId: "RULE-004",
      severityLevel: "",
      violationDescription: "Empty severity level test",
      affectedField: "customer_address",
      suggestedAction: "Standardize address format",
    };

    expect(() => calculateImprovementTargets([invalidRuleViolation])).toThrow(
      /重要度区分/
    );

    try {
      calculateImprovementTargets([invalidRuleViolation]);
    } catch (e: unknown) {
      const thrownError = e as {
        code?: string;
        statusCode?: number;
      };
      expect(thrownError.code).toBe("INVALID_SEVERITY_LEVEL");
      expect(thrownError.statusCode).toBe(400);
    }
  });
});