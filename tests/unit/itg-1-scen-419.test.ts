import { generateSalesRepPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-419
  test("営業担当者情報が欠落している場合、エラーとして処理される", () => {
    const input = {
      salesRepId: "SR001",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      salesRepInfo: {
        name: undefined,
        department: undefined,
        position: undefined,
      },
    };

    expect(() =>
      generateSalesRepPatternAnalysisReport(input)
    ).toThrow(/営業担当者情報/);
  });
});