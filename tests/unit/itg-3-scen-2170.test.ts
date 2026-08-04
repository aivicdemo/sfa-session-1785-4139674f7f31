import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 提案プロセス乖離度の数値化", () => {
  // SCEN-2170
  test("標準プロセスからの乖離度が0%直上のとき、乖離スコアが1以上に繰り上げられる", () => {
    // 標準プロセスからの乖離度 0.01% のテストデータを用意
    const deviationPercentage_001 = 0.01;
    const expectedDeviationScore_001 = 1;

    const result_001 = evaluatePatternRelevance({
      deviationPercentage: deviationPercentage_001,
    });

    expect(result_001.deviationScore).toBe(expectedDeviationScore_001);
    expect(Number.isInteger(result_001.deviationScore)).toBe(true);
    expect(result_001.deviationScore).toBeGreaterThanOrEqual(1);

    // 乖離度 0.001% の場合
    const deviationPercentage_0001 = 0.001;
    const expectedDeviationScore_0001 = 1;

    const result_0001 = evaluatePatternRelevance({
      deviationPercentage: deviationPercentage_0001,
    });

    expect(result_0001.deviationScore).toBe(expectedDeviationScore_0001);
    expect(Number.isInteger(result_0001.deviationScore)).toBe(true);
    expect(result_0001.deviationScore).toBeGreaterThanOrEqual(1);

    // 乖離度 0.005% の場合
    const deviationPercentage_0005 = 0.005;
    const expectedDeviationScore_0005 = 1;

    const result_0005 = evaluatePatternRelevance({
      deviationPercentage: deviationPercentage_0005,
    });

    expect(result_0005.deviationScore).toBe(expectedDeviationScore_0005);
    expect(Number.isInteger(result_0005.deviationScore)).toBe(true);
    expect(result_0005.deviationScore).toBeGreaterThanOrEqual(1);

    // 乖離度 0.009% の場合
    const deviationPercentage_0009 = 0.009;
    const expectedDeviationScore_0009 = 1;

    const result_0009 = evaluatePatternRelevance({
      deviationPercentage: deviationPercentage_0009,
    });

    expect(result_0009.deviationScore).toBe(expectedDeviationScore_0009);
    expect(Number.isInteger(result_0009.deviationScore)).toBe(true);
    expect(result_0009.deviationScore).toBeGreaterThanOrEqual(1);

    // 境界値テスト: 乖離度 0% ちょうどの場合は乖離スコア 0
    const deviationPercentage_0 = 0;
    const expectedDeviationScore_0 = 0;

    const result_0 = evaluatePatternRelevance({
      deviationPercentage: deviationPercentage_0,
    });

    expect(result_0.deviationScore).toBe(expectedDeviationScore_0);
    expect(Number.isInteger(result_0.deviationScore)).toBe(true);
  });
});