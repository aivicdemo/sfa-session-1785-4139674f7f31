import { describe, test, expect } from "@jest/globals";
import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-360: 成約率の端数が出る場合、丸め処理が適切に行われる", () => {
    const salesPersonId = "SP-001";
    const salesPersonName = "営業担当者A";
    const dealClosedCount = 1;
    const dealTotalCount = 3;
    const analysisMonth = "2024-01";

    const input = {
      salesPersonId,
      salesPersonName,
      dealClosedCount,
      dealTotalCount,
      analysisMonth,
    };

    const result = generateSalesActivityPatternReport(input);

    const expectedConversionRateRounded = 33;
    const expectedConversionRateRaw = 33.33333333;

    expect(result).toEqual({
      salesPersonId: "SP-001",
      salesPersonName: "営業担当者A",
      dealClosedCount: 1,
      dealTotalCount: 3,
      conversionRateRounded: expectedConversionRateRounded,
      conversionRateRaw: expectedConversionRateRaw,
      analysisMonth: "2024-01",
    });

    expect(result.conversionRateRounded).toBe(33);
    expect(result.conversionRateRaw).toBeCloseTo(33.33333333, 5);
    expect(result.conversionRateRounded).not.toBe(result.conversionRateRaw);
  });
});