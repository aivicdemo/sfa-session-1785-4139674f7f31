import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2896
  test("推奨内容と成約実績の相関判定 - 相関係数が 0.7 以上のときに妥当と判定される", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        correlationCoefficient: 0.7,
        isViable: true,
        reasoningScore: 0.7,
      }),
    };

    const patternInput = {
      customerId: "CUST-001",
      industryType: "manufacturing",
      companyScale: "mid-market",
      dealAmount: 5000000,
      previousSimilarDeals: [
        {
          dealId: "DEAL-2023-001",
          outcome: "won",
          dealAmount: 4800000,
          correlationWithCurrent: 0.72,
        },
        {
          dealId: "DEAL-2023-002",
          outcome: "won",
          dealAmount: 5200000,
          correlationWithCurrent: 0.68,
        },
      ],
      proposalApproach: "consultative_selling",
      recommendationTimestamp: "2024-01-15T11:00:00Z",
    };

    const result = evaluatePatternRelevance(patternInput, mockAIEngine);

    expect(result.isViable).toBe(true);
    expect(result.reasoningScore).toBe(0.7);
    expect(result.correlationCoefficient).toBe(0.7);
    expect(result.statusForStorage).toBe("Viable");
    expect(result.recommendationDisplayContent).toEqual({
      recommendationText: expect.stringContaining("根拠スコア: 0.70"),
      confidenceLevel: "high",
      correlationBasis: "0.70",
    });
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      patternInput
    );
  });
});