import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-698
  test("対象営業担当者IDが null のとき分析対象者の特定に失敗しエラーになる", () => {
    const invalidInput = {
      salesPersonId: null,
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
    };

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport(invalidInput)
    ).toThrow(/営業担当者ID/);
  });
});