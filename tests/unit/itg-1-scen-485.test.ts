import { describe, test, expect } from "@jest/globals";
import { generateSalesPersonAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-485
  test("営業担当者情報が未定義の場合、レポートが生成されない", () => {
    const undefinedSalesPerson = undefined;
    
    expect(() => {
      generateSalesPersonAnalysisReport(undefinedSalesPerson);
    }).toThrow(/営業担当者情報/);
  });
});