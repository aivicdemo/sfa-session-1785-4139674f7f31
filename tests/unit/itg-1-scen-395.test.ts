import { evaluateSuccessPatternMatrixApplicability } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-395: 提案アプローチが null のとき提示不可として処理が中断される", () => {
    // Arrange
    const input = {
      customerSize: "large",
      industry: "manufacturing",
      proposalAmount: 5000000,
      proposalApproach: null,
      historicalSuccessPatterns: [
        {
          id: "pattern_1",
          customerSize: "large",
          industry: "manufacturing",
          proposalAmountRange: { min: 4000000, max: 6000000 },
          successRate: 0.85,
        },
      ],
      confidenceThreshold: 0.8,
    };

    // Act
    const result = evaluateSuccessPatternMatrixApplicability(input);

    // Assert
    expect(result.status).toBe("UNAVAILABLE");
    expect(result.reason).toBe("ProposalApproach is null");
    expect(result.matrix).toBeNull();
  });
});