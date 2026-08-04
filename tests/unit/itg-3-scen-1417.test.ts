import { evaluateConstraintCompatibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1417
  test("提案内容と顧客制約条件の自動照合機能 - 経営目標データが欠落しているとき、その項目の照合がスキップされる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((params: Record<string, unknown>) => ({
        score: 75,
        isApplicable: true,
      })),
    };

    const customerConstraints = {
      budgetLimit: 5000000,
      budgetCurrency: "JPY",
      implementationDeadline: "2026-12-31",
      industry: "製造業",
      companySize: "large",
      managementGoals: null,
      preferredVendors: ["VendorA"],
    };

    const proposalContent = {
      proposedAmount: 3000000,
      proposedProducts: [
        {
          id: "prod-001",
          name: "ERP System",
          category: "enterprise",
        },
      ],
      implementationTimeline: "2026-06-30",
      alignmentWithGoals: "high",
      businessCaseROI: "250%",
    };

    const result = evaluateConstraintCompatibility(
      proposalContent,
      customerConstraints,
      mockAIEngine
    );

    expect(result).toEqual({
      overallCompatibilityScore: expect.any(Number),
      detailedResults: {
        budgetValidation: {
          skipped: false,
          proposedAmount: 3000000,
          budgetLimit: 5000000,
          withinLimit: true,
        },
        implementationTimingValidation: {
          skipped: false,
          proposedDeadline: "2026-06-30",
          customerDeadline: "2026-12-31",
          meetsTimeline: true,
        },
        industryAlignmentValidation: {
          skipped: false,
          industry: "製造業",
          isAligned: true,
        },
        managementGoalsValidation: {
          skipped: true,
          reason: "managementGoals is missing",
        },
      },
      callRecords: expect.objectContaining({
        evaluatePatternRelevanceCalls: expect.any(Array),
      }),
    });

    const evaluateCalls =
      mockAIEngine.evaluatePatternRelevance.mock.calls as unknown[];
    expect(evaluateCalls.length).toBeGreaterThan(0);

    for (const callArgs of evaluateCalls) {
      const params = callArgs[0] as Record<string, unknown>;
      expect(params).not.toHaveProperty("managementGoals");
    }

    expect(result.detailedResults.managementGoalsValidation.skipped).toBe(true);
    expect(
      result.detailedResults.managementGoalsValidation.reason
    ).toMatch(/managementGoals is missing/);

    expect(result.detailedResults.budgetValidation.skipped).toBe(false);
    expect(result.detailedResults.budgetValidation.withinLimit).toBe(true);

    expect(
      result.detailedResults.implementationTimingValidation.skipped
    ).toBe(false);
    expect(
      result.detailedResults.implementationTimingValidation.meetsTimeline
    ).toBe(true);

    expect(result.detailedResults.industryAlignmentValidation.skipped).toBe(
      false
    );
    expect(result.detailedResults.industryAlignmentValidation.isAligned).toBe(
      true
    );

    expect(result.overallCompatibilityScore).toBeGreaterThanOrEqual(0);
    expect(result.overallCompatibilityScore).toBeLessThanOrEqual(100);
  });
});