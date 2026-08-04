import { calculateImprovementTargets } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム", () => {
  test("SCEN-497: ルール違反の重要度区分が定義済み値以外のとき、エラーが発生する", () => {
    const invalidRuleViolations = [
      {
        ruleId: "RULE_001",
        violationType: "DATA_FORMAT",
        severityLevel: "INVALID_LEVEL",
        affectedCount: 5,
        impactScore: 75,
      },
      {
        ruleId: "RULE_002",
        violationType: "MISSING_FIELD",
        severityLevel: null,
        affectedCount: 3,
        impactScore: 60,
      },
      {
        ruleId: "RULE_003",
        violationType: "DUPLICATE_RECORD",
        severityLevel: undefined,
        affectedCount: 2,
        impactScore: 50,
      },
      {
        ruleId: "RULE_004",
        violationType: "VALUE_RANGE",
        severityLevel: "",
        affectedCount: 8,
        impactScore: 85,
      },
    ];

    for (const violation of invalidRuleViolations) {
      expect(() => {
        calculateImprovementTargets(violation);
      }).toThrow(/重要度区分/);
    }

    try {
      calculateImprovementTargets(invalidRuleViolations[0]);
    } catch (error: unknown) {
      const err = error as { code?: string; statusCode?: number; message?: string };
      expect(err.code).toBe("INVALID_SEVERITY_LEVEL");
      expect(err.statusCode).toBe(400);
      expect(err.message).toMatch(/定義済み値/);
    }
  });
});