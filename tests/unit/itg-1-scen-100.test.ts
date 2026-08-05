import { describe, test, expect } from "@jest/globals";
import { determineSalesProcessLogExtractionRange } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-100
  test("対象営業担当者リストが空配列のときエラーになる", () => {
    const emptyPersonList: string[] = [];
    const startDate = new Date("2024-01-01T00:00:00Z");
    const endDate = new Date("2024-01-31T23:59:59Z");

    expect(() => {
      determineSalesProcessLogExtractionRange({
        targetSalesPersonIds: emptyPersonList,
        extractionStartDate: startDate,
        extractionEndDate: endDate,
      });
    }).toThrow(/営業担当者リスト/);
  });
});