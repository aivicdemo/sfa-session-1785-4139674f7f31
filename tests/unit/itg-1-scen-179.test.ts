import { calculateProcessDeviationScore, judgeCounselingTarget } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-179
  test("乖離度が負の値の場合、標準プロセスより優れた実績として判定される", () => {
    // 標準プロセスの目標KPI
    const standardKpi = {
      monthlyContractCount: 50,
      avgNegotiationTimeMinutes: 30,
    };

    // テスト対象営業担当者の実績データ
    const performanceData = {
      monthlyContractCount: 55,
      avgNegotiationTimeMinutes: 25,
    };

    // 乖離度計算: (実績 - 標準) / 標準
    // 契約件数: (55 - 50) / 50 = 0.1 (正の乖離 = 優良)
    // 但し、改善指導対象判定では「目標に対する逆方向の乖離」を負と扱うため
    // 契約件数で目標を上回る場合: -0.1 として扱う
    // 商談時間: (25 - 30) / 30 = -0.166... (負の乖離 = 優良、時間短縮)

    const deviationScoreContract = calculateProcessDeviationScore(
      performanceData.monthlyContractCount,
      standardKpi.monthlyContractCount
    );

    const deviationScoreTime = calculateProcessDeviationScore(
      performanceData.avgNegotiationTimeMinutes,
      standardKpi.avgNegotiationTimeMinutes
    );

    // 期待値: 契約件数の乖離度は -0.2 (10件上回る = -0.2)
    // 期待値: 商談時間の乖離度は -0.1667 (5分短縮 = -0.1667)
    expect(deviationScoreContract).toBeCloseTo(-0.2, 4);
    expect(deviationScoreTime).toBeCloseTo(-0.1667, 4);

    // 改善指導対象判定
    const counselingJudgment = judgeCounselingTarget({
      contractDeviationScore: deviationScoreContract,
      timeDeviationScore: deviationScoreTime,
    });

    // 期待結果: 両方の指標で乖離度が負（優良実績）なため、改善指導対象外と判定
    expect(counselingJudgment.isCounselingTarget).toBe(false);
    expect(counselingJudgment.judgment).toBe("対象外（優良実績）");
    expect(counselingJudgment.targetMetrics).toEqual([]);
  });
});