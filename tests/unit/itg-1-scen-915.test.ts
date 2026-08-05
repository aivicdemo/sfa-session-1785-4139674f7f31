import {
  analyzeTeamSalesQualityMonthly,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-915: チーム営業品質月次分析機能 - 期間の開始日と終了日が同日のとき統計値が正しく計算される", () => {
    // Arrange
    const analysisPeriodStart = new Date("2024-01-15T00:00:00Z");
    const analysisPeriodEnd = new Date("2024-01-15T23:59:59Z");
    const dealCount = 5;
    const closedDealCount = 2;
    const averageDealDurationMinutes = 45;
    const customerSatisfactionScore = 4.2;
    const sampleDays = 1;
    const periodDays = 1;

    const input = {
      analysisPeriodStart,
      analysisPeriodEnd,
      dealCount,
      closedDealCount,
      averageDealDurationMinutes,
      customerSatisfactionScore,
      sampleDays,
      periodDays,
    };

    // Act
    const result = analyzeTeamSalesQualityMonthly(input);

    // Assert
    expect(result.closingRate).toBe(40.0);
    expect(result.averageDealDurationMinutes).toBe(45);
    expect(result.customerSatisfactionScore).toBe(4.2);
    expect(result.sampleDays).toBe(1);
    expect(result.periodDays).toBe(1);
  });
});