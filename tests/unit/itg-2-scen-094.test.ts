import { validateSalesData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-094
  test("同じ入力データで検証を2回実行しても同じ結果が得られる", () => {
    const testData = {
      customerName: "山田太郎",
      salesAmount: 500000,
      contractDate: "2024-01-15",
    };

    const firstValidationResult = validateSalesData(testData);
    const secondValidationResult = validateSalesData(testData);

    expect(firstValidationResult.errorCodes).toEqual(
      secondValidationResult.errorCodes
    );
    expect(firstValidationResult.warningMessages).toEqual(
      secondValidationResult.warningMessages
    );
    expect(firstValidationResult.validationScore).toBe(
      secondValidationResult.validationScore
    );
    expect(firstValidationResult.validationScore).toBe(85.5);
  });
});