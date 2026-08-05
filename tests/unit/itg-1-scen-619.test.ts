import { analyzeCareerAndDealPerformance } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-619
  test("分析対象の営業担当者が営業担当者マスタに存在しないときエラーになる", () => {
    const nonExistentSalesPersonId = "SP_NOT_FOUND_001";
    const analysisParams = {
      salesPersonId: nonExistentSalesPersonId,
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
    };

    expect(() => analyzeCareerAndDealPerformance(analysisParams)).toThrow(
      /指定された営業担当者が営業担当者マスタに存在しません/
    );
  });
});