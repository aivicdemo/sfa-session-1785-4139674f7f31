import { validateDateFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン - 日付形式検証", () => {
  test("SCEN-1117: ISO 8601非準拠の日付形式は形式検証に不合格となる", () => {
    // ISO 8601非準拠の形式を持つ事例データ
    const invalidDateFormats = [
      { date: "2024/01/15", fieldName: "date" },
      { date: "15-01-2024", fieldName: "date" },
      { date: "2024年1月15日", fieldName: "date" },
    ];

    invalidDateFormats.forEach((testData) => {
      const result = validateDateFormat(testData.date, testData.fieldName);

      expect(result).toEqual({
        isValid: false,
        errorCode: "INVALID_DATE_FORMAT",
        errorMessage:
          "日付形式はISO 8601形式（YYYY-MM-DD）で指定してください",
        fieldName: "date",
      });
    });
  });
});