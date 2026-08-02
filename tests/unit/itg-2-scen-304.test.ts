import { detectDeviationPattern } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-304
  test("乖離パターン検出 - 全ステップが標準プロセスより遅いとき、『全体停滞』パターンとして検出される", () => {
    const standardProcessSteps = [
      { step_name: "ステップA", standard_duration_minutes: 10 },
      { step_name: "ステップB", standard_duration_minutes: 15 },
      { step_name: "ステップC", standard_duration_minutes: 20 },
    ];

    const actualPerformanceData = [
      { step_name: "ステップA", actual_duration_minutes: 12 },
      { step_name: "ステップB", actual_duration_minutes: 18 },
      { step_name: "ステップC", actual_duration_minutes: 24 },
    ];

    const result = detectDeviationPattern(
      standardProcessSteps,
      actualPerformanceData
    );

    expect(result.pattern_name).toBe("全体停滞");
    expect(result.matching_steps_count).toBe("3/3（全ステップ）");
    expect(result.step_delays).toEqual([
      {
        step_name: "ステップA",
        delay_rate_percent: 20,
      },
      {
        step_name: "ステップB",
        delay_rate_percent: 20,
      },
      {
        step_name: "ステップC",
        delay_rate_percent: 20,
      },
    ]);
    expect(result.judgment_basis).toBe("全ステップが標準プロセス時間を超過");
  });
});