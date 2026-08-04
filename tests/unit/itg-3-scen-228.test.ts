import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-228
  test("推奨根拠の成功パターンマッチスコアが-1のとき、根拠表示処理がエラーになる", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(-1),
    };

    const recommendationReasoningInput = {
      patternRelevanceScore: -1,
      recommendationId: "rec-001",
      customerAttributes: {
        industry: "manufacturing",
        scale: "mid-size",
      },
      businessIssues: ["cost_reduction", "efficiency"],
      proposalApproach: "standard_approach",
      successPatternId: "pattern-001",
      evaluationTimestamp: new Date("2024-11-15T09:30:00Z"),
    };

    let capturedError: Error | null = null;
    let capturedLogMessage: string | null = null;

    const mockLogger = {
      error: jest.fn((msg: string) => {
        capturedLogMessage = msg;
      }),
      info: jest.fn(),
      warn: jest.fn(),
    };

    try {
      explainRecommendationReasoning(
        recommendationReasoningInput,
        mockAIRecommendationEngine,
        mockLogger
      );
    } catch (error) {
      capturedError = error as Error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError?.message).toMatch(/不正な根拠スコア/);
    expect(capturedLogMessage).toMatch(/patternRelevanceScore=-1 is invalid/);
  });
});