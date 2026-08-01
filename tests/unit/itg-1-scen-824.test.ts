import { calculateDeviationRate } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-824
  test("乖離度計算で端数が生じる場合、指定された小数点以下桁数で丸め処理を実行する", () => {
    const targetValue = 100;
    const actualValue = 33.333;
    const decimalPlaces = 1;

    const result = calculateDeviationRate(
      targetValue,
      actualValue,
      decimalPlaces
    );

    expect(result).toBe(33.3);
  });
});