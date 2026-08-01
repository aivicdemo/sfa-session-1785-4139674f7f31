import { generateSalesPerformanceAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-327
  test("成約実績データが欠落している場合、成約率計算が正常に処理される", () => {
    const salesRepRecords = [
      {
        salesRepId: "A001",
        name: "営業太郎",
        totalVisits: 10,
        contractedDeals: 5,
      },
      {
        salesRepId: "A001",
        name: "営業太郎",
        totalVisits: 8,
        contractedDeals: null,
      },
    ];

    const result = generateSalesPerformanceAnalysisReport(salesRepRecords);

    expect(result).toBeDefined();
    expect(result.salesRepId).toBe("A001");
    expect(result.contractRate).toBe(50.0);
    expect(result.contractRate).toBeGreaterThanOrEqual(0);
    expect(result.contractRate).toBeLessThanOrEqual(100);
  });
});