import { evaluateInferenceAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2395
  test("推論精度スコア算出機能 - 提案内容と顧客対応パターンの不整合があり、評価不可のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: null,
        isCompatible: false,
        errorCode: "PATTERN_MISMATCH"
      })
    };

    const mockSystemLogger = {
      log: jest.fn()
    };

    const proposalContent = {
      proposalId: "PROP-20240115-001",
      productCategory: "CloudInfrastructure",
      estimatedBudget: 5000000,
      implementationPeriod: 6
    };

    const customerInteractionPattern = {
      customerId: "CUST-20240115-999",
      lastInteractionDate: "2024-01-10T15:30:00Z",
      responsiveness: "High",
      decisionMakingProcess: "CommitteeApproval"
    };

    const result = evaluateInferenceAccuracy(
      proposalContent,
      customerInteractionPattern,
      mockAIRecommendationEngine,
      mockSystemLogger
    );

    expect(result.errorCode).toBe("PATTERN_INCOMPATIBILITY");
    expect(result.errorMessage).toBe(
      "提案内容と顧客対応パターンが不整合のため、推論精度スコアを算出できません"
    );
    expect(result.statusCode).toBe(422);
    expect(mockSystemLogger.log).toHaveBeenCalledWith(
      expect.stringMatching(/evaluatePatternRelevance: Pattern mismatch detected/)
    );
    expect(result.userMessage).toBeDefined();
    expect(result.userMessage).not.toContain("relevanceScore");
    expect(result.userMessage).not.toContain("PATTERN_MISMATCH");
  });
});