import { evaluateProposalPatternConformance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2076
  test("提案内容が空の場合、標準プロセス乖離スコアが0で返される", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({ score: 0 }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealData = {
      dealId: "DEAL-2076-001",
      customerId: "CUST-2076-001",
      proposalContent: "",
      customerInteractionPattern: {
        touchPointCount: 3,
        lastTouchDate: "2024-06-15",
        responseRate: 0.75,
      },
      proposedAt: "2024-06-15T10:30:00Z",
    };

    const result = evaluateProposalPatternConformance(
      dealData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      standardProcessDeviationScore: 0,
      conformanceAnalysisPerformed: true,
    });

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});