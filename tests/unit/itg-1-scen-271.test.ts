import { describe, test, expect } from "@jest/globals";
import { analyzeAndRecommendActionImprovements } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-271
  test("提案内容データが空配列のとき、処理が中断される", () => {
    const emptyProposalData: any[] = [];
    const salesPersonId = "sales_001";
    const analysisStartDate = new Date("2024-01-01T00:00:00Z");
    const analysisEndDate = new Date("2024-01-31T23:59:59Z");

    const result = analyzeAndRecommendActionImprovements({
      proposalData: emptyProposalData,
      salesPersonId: salesPersonId,
      startDate: analysisStartDate,
      endDate: analysisEndDate,
    });

    expect(result.isError).toBe(true);
    expect(result.errorCode).toBe("提案内容データが空です");
    expect(result.behaviorPatterns).toBeUndefined();
    expect(result.improvementRecommendations).toBeUndefined();
  });
});