import { selectAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-760: 行動パターン分析対象指標の自動選定機能 - プロセス監査トリガーにより指標選定が実行される", () => {
    const processId = "PROC-001";
    const auditExecutedAt = new Date("2024-01-15T09:00:00Z");
    const analysisStartDate = new Date("2023-10-15T09:00:00Z");
    const analysisEndDate = new Date("2024-01-15T09:00:00Z");

    const input = {
      processId: processId,
      auditExecutedAt: auditExecutedAt,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
    };

    const result = selectAnalysisIndicators(input);

    expect(result.processId).toBe("PROC-001");
    expect(result.selectedIndicators).toEqual([
      "営業機会の進捗率",
      "商談平均日数",
      "顧客接触頻度",
    ]);
    expect(result.selectedAt).toEqual(new Date("2024-01-15T09:00:00Z"));
    expect(result.analysisStartDate).toEqual(
      new Date("2023-10-15T09:00:00Z")
    );
    expect(result.analysisEndDate).toEqual(new Date("2024-01-15T09:00:00Z"));
    expect(Array.isArray(result.selectedIndicators)).toBe(true);
    expect(result.selectedIndicators.length).toBe(3);
  });
});