import { generateSalesRepAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-615
  test("成約数が0件の場合、成約率が0と計算される", () => {
    const input = {
      salesRepId: "rep-001",
      salesRepName: "営業担当者A",
      contactCount: 10,
      proposalCount: 5,
      contractCount: 0,
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
    };

    const result = generateSalesRepAnalysisReport(input);

    expect(result).toEqual({
      salesRepId: "rep-001",
      salesRepName: "営業担当者A",
      contactCount: 10,
      proposalCount: 5,
      contractCount: 0,
      contractRate: 0.0,
      contractRatePercentage: "0%",
      analysisStartDate: "2024-01-01",
      analysisEndDate: "2024-01-31",
      isNormalValue: true,
    });

    expect(typeof result.contractRate).toBe("number");
    expect(isFinite(result.contractRate)).toBe(true);
    expect(isNaN(result.contractRate)).toBe(false);
  });
});