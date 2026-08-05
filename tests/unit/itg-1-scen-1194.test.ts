import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeConversionRateCorrelation } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1194
  it("成約率が負の値のとき処理がエラーになる", () => {
    const invalidConversionRate = -0.5;
    const salesRepId = "rep_12345";
    const analysisStartDate = "2024-01-01T00:00:00Z";
    const analysisEndDate = "2024-01-31T23:59:59Z";

    expect(() =>
      analyzeConversionRateCorrelation({
        conversionRate: invalidConversionRate,
        salesRepId: salesRepId,
        startDate: analysisStartDate,
        endDate: analysisEndDate,
      })
    ).toThrow(/成約率は0以上1以下の値を入力してください/);
  });
});