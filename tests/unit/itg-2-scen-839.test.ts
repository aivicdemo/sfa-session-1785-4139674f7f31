import { calculateConversionRate } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業プロセス実行状況分析機能", () => {
  test("SCEN-839: 成約率計算で端数が発生するとき、小数点第2位で四捨五入が適用される", () => {
    // Arrange
    const closed_deals = 1;
    const total_deals = 3;
    const rounding_decimal_places = 2;

    // Act
    const result = calculateConversionRate(
      closed_deals,
      total_deals,
      rounding_decimal_places
    );

    // Assert
    expect(result).toBe(33.33);
  });
});