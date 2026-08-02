import { describe, test, expect } from "@jest/globals";
import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-599
  test("妥当性検証で金額が許容範囲下限直下の場合、合格と判定される", () => {
    const validator = validateSalesDataQuality();

    validator.setValidationRule({
      fieldName: "amount",
      ruleType: "range",
      minValue: 1000,
      maxValue: 100000,
    });

    const salesData = {
      id: "SD001",
      customerId: "CUST001",
      amount: 999,
      date: "2024-01-15",
    };

    const result = validator.validate(salesData);

    expect(result.status).toBe("PASS");
    expect(result.errorMessage).toBeUndefined();
    expect(result.fieldName).toBe("amount");
    expect(result.isValid).toBe(true);
  });
});