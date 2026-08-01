import {
  analyzeProcessDeviationAndCorrelation,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-847: [edge] 営業プロセス標準書との乖離分析と成約実績の相関分析 - 成約率がちょうど100%の場合、相関分析を実行する
  test("成約率100%のデータセットで相関分析が正常に完了し、相関係数が計算される", () => {
    const salesRepresentativeId = "sales_rep_001";
    const dealCount = 10;
    const closedDealCount = 10;
    const correlationAnalysisDate = new Date("2024-01-15T11:00:00Z");
    const deviationFromStandardProcess = [
      {
        processStep: "initial_contact",
        deviationPercentage: 5,
      },
      {
        processStep: "proposal",
        deviationPercentage: -3,
      },
      {
        processStep: "negotiation",
        deviationPercentage: 2,
      },
      {
        processStep: "contract",
        deviationPercentage: 1,
      },
    ];

    const result = analyzeProcessDeviationAndCorrelation({
      salesRepresentativeId,
      dealCount,
      closedDealCount,
      deviationFromStandardProcess,
      analysisDate: correlationAnalysisDate,
    });

    expect(result.closureRate).toBe(1.0);
    expect(result.correlationCoefficientValue).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlationCoefficientValue).toBeLessThanOrEqual(1.0);
    expect(result.analysisResultDatasetCount).toBe(10);
    expect(result.analysisResultReport).toContain("成約率：100%");
    expect(result.analysisResultReport).toContain(
      "相関分析対象データセット件数：10件"
    );
    expect(result.analysisResultReport).toMatch(/相関係数：-?[0-9]+\.?[0-9]*/);
    expect(result.analysisResultReport).toMatch(/計算実行時刻：2024-01-15/);
    expect(result.auditLogEntry.calculationFormula).toBeDefined();
    expect(result.auditLogEntry.intermediateResults).toBeDefined();
    expect(result.auditLogEntry.inputDataSnapshot.closureRate).toBe(1.0);
    expect(result.auditLogEntry.inputDataSnapshot.datasetCount).toBe(10);
    expect(Array.isArray(result.auditLogEntry.deviationDataUsedInCalculation)).toBe(
      true
    );
    expect(
      result.auditLogEntry.deviationDataUsedInCalculation.length
    ).toBeGreaterThan(0);
  });
});