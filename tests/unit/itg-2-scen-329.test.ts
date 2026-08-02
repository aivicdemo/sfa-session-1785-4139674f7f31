import { calculateDeviationCorrelation } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-329
  test("成約実績が1件の営業担当者について相関係数が計算される", () => {
    const salesRepresentativeId = "sales_rep_a";
    const deviationScore = 0.75;
    const closedDealRecords = [
      {
        dealId: "deal_001",
        closedAmount: 1000000,
        closedDate: new Date("2024-01-15T00:00:00Z"),
      },
    ];

    const result = calculateDeviationCorrelation({
      salesRepresentativeId,
      deviationScore,
      closedDealRecords,
    });

    expect(result).toEqual({
      correlationCoefficient: null,
      errorCode: "INSUFFICIENT_DATA_POINTS",
      message: "相関係数の計算には最低2件の成約実績が必要です",
    });
  });
});