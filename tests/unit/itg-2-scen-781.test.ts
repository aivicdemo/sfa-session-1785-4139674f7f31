import { calculateProcessDeviationScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能 - 乖離度計算エンジン", () => {
  test("SCEN-781: 標準プロセスからの乖離度が閾値ちょうど（±5%）の場合、乖離度が正確に計算される", () => {
    // 1回目シナリオ: 標準値100.0、実績値105.0で乖離度+5.0%
    const standard_value_1 = 100.0;
    const actual_value_1 = 105.0;
    const expected_deviation_1 = 5.0;

    const result_1 = calculateProcessDeviationScore(
      standard_value_1,
      actual_value_1
    );

    expect(result_1).toBe(expected_deviation_1);

    // 2回目シナリオ: 標準値200.0、実績値190.0で乖離度-5.0%
    const standard_value_2 = 200.0;
    const actual_value_2 = 190.0;
    const expected_deviation_2 = -5.0;

    const result_2 = calculateProcessDeviationScore(
      standard_value_2,
      actual_value_2
    );

    expect(result_2).toBe(expected_deviation_2);
  });
});