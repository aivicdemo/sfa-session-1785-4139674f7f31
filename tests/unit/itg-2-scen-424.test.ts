import { reValidateQualityAfterCorrection } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-424: [edge] 修正済みデータ品質再検証 - 品質ルールが1件の場合、そのルール検証結果が反映される
  test("should reflect quality rule validation result when single rule is defined", () => {
    const correctedRecord = {
      id: "record-001",
      salesPersonName: "山田太郎",
      customerId: "cust-001",
    };

    const qualityRule = {
      id: "rule-001",
      ruleName: "営業担当者名非空チェック",
      ruleType: "NOT_EMPTY",
      targetField: "salesPersonName",
      validate: (value: string) => value && value.trim() !== "",
    };

    const validationResult = reValidateQualityAfterCorrection(
      correctedRecord,
      [qualityRule]
    );

    expect(validationResult.totalRulesChecked).toBe(1);
    expect(validationResult.passedRules).toBe(1);
    expect(validationResult.failedRules).toBe(0);
    expect(validationResult.ruleResults).toEqual([
      {
        ruleId: "rule-001",
        ruleName: "営業担当者名非空チェック",
        passed: true,
        targetField: "salesPersonName",
        recordValue: "山田太郎",
        message: "営業担当者名『山田太郎』は空文字列ではない",
      },
    ]);
    expect(validationResult.overallStatus).toBe("PASSED");
  });
});