import { validateDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-605: 妥当性検証で日付が月初日の場合、合格と判定される", () => {
    const validationInput = {
      dateField: "2024-01-01",
      dataType: "date",
    };

    const result = validateDataQuality(validationInput);

    expect(result.status).toBe("合格");
    expect(result.errorMessage).toBe("");
    expect(result.isValid).toBe(true);
  });
});