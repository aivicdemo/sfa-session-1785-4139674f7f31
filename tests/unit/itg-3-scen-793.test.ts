import { calculateRecommendationTrustScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-793: 推奨信頼度スコア算出機能 - 根拠データが1件のとき、信頼度が正常に算出される", () => {
    // Arrange
    const mockEvaluatePatternRelevance = jest.fn((pattern) => {
      if (pattern.patternId === "PAT-001") {
        return { score: 0.85, relevanceDetails: { applicability: 0.85 } };
      }
      return { score: 0, relevanceDetails: {} };
    });

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const evidenceData = [
      {
        patternId: "PAT-001",
        pastSuccessPatternId: "PAT-001",
        applicabilityScore: 0.85,
        evidenceType: "historical_pattern",
        sourceData: { customerId: "CUST-001", dealType: "enterprise" },
      },
    ];

    // Act
    const result = calculateRecommendationTrustScore(
      evidenceData,
      mockAIRecommendationEngine
    );

    // Assert - 信頼度スコアの値
    expect(result.trustScore).toBe(85);

    // Assert - 根拠データ件数
    expect(result.evidenceCount).toBe(1);

    // Assert - 各根拠スコア
    expect(result.individualScores).toEqual([0.85]);

    // Assert - 加重平均信頼度
    expect(result.weightedAverageTrustDegree).toBe(0.85);

    // Assert - 計算ログの検証
    expect(result.calculationLog).toContain("根拠データ件数: 1");
    expect(result.calculationLog).toContain("各根拠スコア: [0.85]");
    expect(result.calculationLog).toContain("加重平均信頼度: 0.85");

    // Assert - 正規化済みスコアであることの確認
    expect(result.isNormalized).toBe(true);

    // Assert - 外部API呼び出しの検証
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: "PAT-001",
      })
    );
  });
});