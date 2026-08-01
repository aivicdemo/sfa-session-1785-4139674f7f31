import { calculateDivergenceAndJudgeImprovement } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-176: 乖離度が正のわずかな値の場合、許容範囲内として判定される", () => {
    // 入力データ: 乖離度0.05、許容範囲閾値0.1
    const divergenceValue = 0.05;
    const toleranceThreshold = 0.1;
    const salesPersonId = "SP001";
    const analysisDate = "2024-01-15";

    // 改善指導対象判定関数を呼び出す
    const result = calculateDivergenceAndJudgeImprovement({
      divergenceValue: divergenceValue,
      toleranceThreshold: toleranceThreshold,
      salesPersonId: salesPersonId,
      analysisDate: analysisDate,
    });

    // 期待結果の検証
    // 1. 判定結果が『許容範囲内』として返却される
    expect(result.judgement).toBe("許容範囲内");

    // 2. 改善指導対象フラグが false に設定される
    expect(result.isImprovementTarget).toBe(false);

    // 3. 改善指導の推奨レベルが『対応不要』と判定される
    expect(result.recommendedLevel).toBe("対応不要");

    // 追加の検証: 計算結果の整合性
    expect(result.divergenceValue).toBe(0.05);
    expect(result.toleranceThreshold).toBe(0.1);
    expect(result.isWithinTolerance).toBe(true);
  });
});