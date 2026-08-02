import { validateSalesDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-373
  test("入力漏れが必須項目1つの場合、その項目の不足として報告される", () => {
    fetchMock.resetMocks();

    const requiredFields = [
      "顧客名",
      "売上金額",
      "商談ステージ",
      "担当者ID",
    ];

    const inputData = {
      顧客名: "ABC株式会社",
      売上金額: 500000,
      商談ステージ: "提案中",
      担当者ID: "",
    };

    const result = validateSalesDataQuality({
      requiredFields,
      inputData,
    });

    expect(result.missingFields).toEqual(["担当者ID"]);
    expect(result.errorLevel).toBe("MISSING_REQUIRED_FIELD");
    expect(result.missingFieldCount).toBe(1);
    expect(result.hasError).toBe(true);
  });
});