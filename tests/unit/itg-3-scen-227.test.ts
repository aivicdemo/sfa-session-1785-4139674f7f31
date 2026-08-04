import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-227: 推奨根拠に紐付く提案アプローチが削除されている場合、根拠表示処理がエラーになる", () => {
    const recommendationId = "REC-001";
    const deletedApproachId = "APPROACH-A";

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockProposalApproachRepository = {
      findById: jest.fn((id: string) => {
        if (id === deletedApproachId) {
          return null;
        }
        return { id, name: "Sample Approach" };
      }),
    };

    mockAIEngine.explainRecommendationReasoning.mockReturnValue({
      recommendationId,
      reasoning: `このアプローチは${deletedApproachId}に基づいています`,
      approachId: deletedApproachId,
    });

    expect(() => {
      explainRecommendationReasoning(
        recommendationId,
        mockAIEngine,
        mockProposalApproachRepository
      );
    }).toThrow(/紐付く提案アプローチが見つかりません/);
  });
});