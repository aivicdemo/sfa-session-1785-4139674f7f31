import { evaluateSalesRepImprovement } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-168: 営業担当者行動パターン分析結果が0件の場合、判定結果が空またはスキップされる", async () => {
    const salesRepId = "SR001";
    const analysisResult = [];

    const judgementResult = evaluateSalesRepImprovement({
      salesRepId,
      analysisPatterns: analysisResult,
    });

    expect(
      judgementResult === null ||
        judgementResult === undefined ||
        judgementResult.status === "SKIPPED"
    ).toBe(true);

    if (judgementResult !== null && judgementResult !== undefined) {
      expect(judgementResult.status).toBe("SKIPPED");
      expect(judgementResult.improvementRecords).toEqual([]);
    }
  });
});