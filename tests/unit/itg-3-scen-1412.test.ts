import { evaluateProposalConstraintMatch } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合", () => {
  // SCEN-1412
  test("実装期間が月末と月初をまたぐとき、投資対効果が正しく計算される", () => {
    const proposalData = {
      proposalAmount: 1000000,
      startDate: new Date("2024-01-31T00:00:00Z"),
      endDate: new Date("2024-02-01T00:00:00Z"),
      durationDays: 2,
    };

    const customerConstraints = {
      monthlyBudgetLimit: 500000,
      roiCalculationBasis: "monthly_proration",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalAmount: 1000000,
        durationDays: 2,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluateProposalConstraintMatch(
      proposalData,
      customerConstraints,
      mockAIEngine
    );

    expect(result).toEqual({
      januaryProratedAmount: 500000,
      februaryProratedAmount: 500000,
      januaryROI: expect.any(Number),
      februaryROI: expect.any(Number),
      monthCrossed: true,
      budgetCompliance: {
        january: {
          isWithinLimit: true,
          amount: 500000,
          limit: 500000,
        },
        february: {
          isWithinLimit: true,
          amount: 500000,
          limit: 500000,
        },
      },
    });

    expect(result.januaryProratedAmount).toBe(500000);
    expect(result.februaryProratedAmount).toBe(500000);
    expect(result.monthCrossed).toBe(true);
    expect(result.budgetCompliance.january.isWithinLimit).toBe(true);
    expect(result.budgetCompliance.february.isWithinLimit).toBe(true);
    expect(result.januaryROI).toBeGreaterThanOrEqual(0);
    expect(result.februaryROI).toBeGreaterThanOrEqual(0);
  });
});