import { analyzePerformancePattern } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-499
  test("成約実績が閾値100%を超過した場合に行動パターンが優秀と判定される", () => {
    const salesPersonId = "SP001";
    const conversationRate = 1.01; // 101%
    const actionFrequency = 15;
    const proposalQuality = 0.92;
    const followUpInterval = 3;
    const analysisDate = new Date("2024-01-15T10:00:00Z");

    const result = analyzePerformancePattern({
      salesPersonId,
      conversationRate,
      actionFrequency,
      proposalQuality,
      followUpInterval,
      analysisDate,
    });

    expect(result.judgment).toBe("優秀");
    expect(result.qualificationLevel).toBe("excellent");
  });
});