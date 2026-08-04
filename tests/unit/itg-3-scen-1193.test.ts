import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1193: [normal] 提案妥当性判定機能 - 営業プロセスが非標準フローの場合に妥当性判定が実行される", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 0.75,
        flowComplianceStatus: "非標準フロー対応済み",
        successPatternIds: [
          "PATTERN_001",
          "PATTERN_002",
          "PATTERN_003",
          "PATTERN_004",
        ],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealData = {
      customerId: "CUST_001",
      industryType: "小売",
      dealStage: "提案前",
      nonStandardFlowId: "CUSTOM_NEGOTIATION_001",
      dealDescription: "複数提案並行対応",
    };

    const flowInfo = {
      flowType: "非標準フロー",
      flowId: "CUSTOM_NEGOTIATION_001",
      description: "複数提案並行→カスタム交渉フロー",
    };

    return evaluateProposalValidity(
      dealData,
      flowInfo,
      mockAIRecommendationEngine
    ).then((result) => {
      expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

      expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.6);
      expect(result.applicabilityScore).toBe(0.75);

      expect(result.flowComplianceStatus).toBe("非標準フロー対応済み");

      expect(Array.isArray(result.successPatternIds)).toBe(true);
      expect(result.successPatternIds.length).toBeGreaterThanOrEqual(3);
      expect(result.successPatternIds).toContain("PATTERN_001");
      expect(result.successPatternIds).toContain("PATTERN_002");
      expect(result.successPatternIds).toContain("PATTERN_003");
    });
  });
});