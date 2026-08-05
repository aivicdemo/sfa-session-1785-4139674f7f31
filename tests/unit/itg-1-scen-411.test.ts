import { describe, test, expect, beforeEach } from "@jest/globals";
import { analyzeSuccessPatternApplicability } from "../../src/logic/it-1-br-2-1-1";

describe("IT-1-BR-2-1-1: 成功パターン適用判定機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-411
  test("should correctly aggregate sales results across month boundaries when reference period spans January 15 to February 10", () => {
    const referenceStartDate = new Date("2024-01-15T00:00:00Z");
    const referenceEndDate = new Date("2024-02-10T23:59:59Z");

    const salesResultsJanuary = {
      transactionDate: new Date("2024-01-20T10:30:00Z"),
      salesAmount: 5000000,
      dealId: "deal-001",
      salesPersonId: "sp-001",
    };

    const salesResultsFebruary = {
      transactionDate: new Date("2024-02-05T14:15:00Z"),
      salesAmount: 3000000,
      dealId: "deal-002",
      salesPersonId: "sp-001",
    };

    const successPatternInput = {
      referenceStartDate: referenceStartDate,
      referenceEndDate: referenceEndDate,
      salesResults: [salesResultsJanuary, salesResultsFebruary],
      successPatternId: "pattern-001",
      salesPersonId: "sp-001",
    };

    const result = analyzeSuccessPatternApplicability(successPatternInput);

    expect(result.totalSalesAmount).toBe(8000000);
    expect(result.referenceStartDate).toEqual(referenceStartDate);
    expect(result.referenceEndDate).toEqual(referenceEndDate);
    expect(result.aggregatedResultCount).toBe(2);
    expect(result.isSuccessPatternApplicable).toBe(true);
  });
});