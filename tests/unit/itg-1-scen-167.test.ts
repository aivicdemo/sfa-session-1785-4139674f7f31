import { analyzeAndJudgeSalesCoachingTarget } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-167
  test("標準プロセスとの乖離度が計算され、成約実績との相関から改善指導対象者が正しく判定される", () => {
    const salesRepId = "sales_rep_A";
    const actionLog = {
      visitCount: 15,
      proposalCount: 8,
      followUpCount: 5,
    };
    const standardProcess = {
      visitCount: 20,
      proposalCount: 12,
      followUpCount: 10,
    };
    const salesAchievement = {
      contractCount: 2,
      totalProposalCount: 15,
      contractRate: 13.3,
    };
    const teamAverageContractRate = 18;
    const deviationThresholdPercent = 30;

    const result = analyzeAndJudgeSalesCoachingTarget({
      salesRepId,
      actionLog,
      standardProcess,
      salesAchievement,
      teamAverageContractRate,
      deviationThresholdPercent,
    });

    expect(result.isCoachingTarget).toBe(true);
    expect(result.deviationRates).toEqual({
      visitDeviation: -25,
      proposalDeviation: -33.3,
      followUpDeviation: -50,
    });
    expect(result.exceedsDeviationThreshold).toBe(true);
    expect(result.contractRateBelowTeamAverage).toBe(true);
    expect(result.reasoning).toMatch(/提案プロセス/);
    expect(result.reasoning).toMatch(/33\.3%/);
    expect(result.reasoning).toMatch(/フォローアップ/);
    expect(result.reasoning).toMatch(/50%/);
    expect(result.reasoning).toMatch(/13\.3%/);
    expect(result.reasoning).toMatch(/18%/);
  });
});