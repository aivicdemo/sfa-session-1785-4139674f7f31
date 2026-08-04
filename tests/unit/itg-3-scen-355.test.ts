import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-355: 精度計測値が null のとき、閾値比較がエラーになり、統計的に上位の成功パターンが返却される", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const topSuccessPatterns = [
      {
        pattern_id: "pat_001",
        customer_industry: "manufacturing",
        proposal_type: "cost_reduction",
        success_rate: 0.92,
        frequency_rank: 1,
      },
      {
        pattern_id: "pat_002",
        customer_industry: "manufacturing",
        proposal_type: "efficiency",
        success_rate: 0.88,
        frequency_rank: 2,
      },
    ];

    const input = {
      current_deal_id: "deal_12345",
      customer_attributes: {
        industry: "manufacturing",
        company_size: 500,
      },
      proposal_content: {
        type: "cost_reduction",
        estimated_investment: 150000,
      },
      ai_engine: mockAIEngine,
      success_pattern_master: topSuccessPatterns,
      threshold: 0.7,
    };

    let thrownError: Error | null = null;
    let fallbackPatterns: typeof topSuccessPatterns | null = null;

    try {
      const result = evaluateRecommendationAccuracy(input);
      fallbackPatterns = result;
    } catch (error) {
      if (error instanceof Error) {
        thrownError = error;
      }
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError).toEqual(
      expect.objectContaining({
        name: expect.stringMatching(/TypeError|RangeError/),
        message: expect.stringMatching(/精度計測値|null値/),
      })
    );

    expect(fallbackPatterns).toBeDefined();
    expect(Array.isArray(fallbackPatterns)).toBe(true);
    expect(fallbackPatterns).toHaveLength(2);
    expect(fallbackPatterns![0]).toEqual({
      pattern_id: "pat_001",
      customer_industry: "manufacturing",
      proposal_type: "cost_reduction",
      success_rate: 0.92,
      frequency_rank: 1,
    });
    expect(fallbackPatterns![0].success_rate).toBe(0.92);
    expect(fallbackPatterns![0].frequency_rank).toBe(1);
  });
});