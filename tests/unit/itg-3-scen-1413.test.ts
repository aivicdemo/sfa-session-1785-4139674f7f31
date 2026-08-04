import { calculateInvestmentReturnRatio } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合", () => {
  // SCEN-1413
  test("実装期間が年度をまたぐとき、投資対効果が正しく計算される", () => {
    const implementationStartDate = new Date("2025-02-01");
    const implementationEndDate = new Date("2026-03-31");

    const proposalContent = {
      totalInvestmentAmount: 5000000,
      effectByFiscalYear: {
        fy2024: 0,
        fy2025: 3000000,
        fy2026: 4000000,
      },
    };

    const customerConstraints = {
      implementationStartDate,
      implementationEndDate,
    };

    const result = calculateInvestmentReturnRatio(
      proposalContent,
      customerConstraints
    );

    expect(result.investmentReturnRatio).toBe(70.0);
    expect(result.totalEffectAmount).toBe(7000000);
    expect(result.effectByFiscalYear.fy2024).toBe(0);
    expect(result.effectByFiscalYear.fy2025).toBe(3000000);
    expect(result.effectByFiscalYear.fy2026).toBe(4000000);
    expect(result.cumulativeEffectAtEndOfPeriod).toBe(7000000);
  });
});