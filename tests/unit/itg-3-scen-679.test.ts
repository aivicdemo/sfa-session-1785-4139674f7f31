import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・推奨機能", () => {
  // SCEN-679
  test("過去成功パターンの関連度スコアが閾値超の場合、最優先の推奨パターンとして返される", () => {
    const mockSuccessPatterns = [
      {
        id: "DEAL-2024-001",
        industry: "金融",
        proposalApproach: "コスト最適化提案",
        relevanceScore: 0.85,
        priority: 1,
      },
      {
        id: "DEAL-2024-002",
        industry: "金融",
        proposalApproach: "業務効率化提案",
        relevanceScore: 0.75,
        priority: 2,
      },
      {
        id: "DEAL-2024-003",
        industry: "製造業",
        proposalApproach: "デジタル変革提案",
        relevanceScore: 0.60,
        priority: 3,
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern: any) => {
        if (pattern.relevanceScore === 0.85) {
          return { score: 0.85, isRelevant: true };
        }
        return { score: pattern.relevanceScore, isRelevant: false };
      }),
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      industry: "金融",
      budgetMin: 10000000,
      decisionMakerCount: 3,
      threshold: 0.7,
    };

    const result = findSimilarPatterns(
      dealCondition,
      mockSuccessPatterns,
      mockAIEngine
    );

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("DEAL-2024-001");
    expect(result[0].relevanceScore).toBe(0.85);
    expect(result[0].priority).toBe(1);
    expect(result[0].proposalApproach).toBe("コスト最適化提案");
    expect(result[0].industry).toBe("金融");
  });
});