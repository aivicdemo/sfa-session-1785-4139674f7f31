import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1373: explainRecommendationReasoning が失敗したとき簡略版根拠を表示する", async () => {
    // Arrange: AIRecommendationEngine のスタブを失敗状態に設定
    const failingAIEngine = {
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error("API call failed")
      ),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客の経営課題に対する段階的なアプローチ",
        trustScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    // 内部推奨パターンマスタのスタブ（統計的に上位の成功パターン）
    const recommendationPatternMaster = {
      patterns: [
        {
          patternId: "pattern_001",
          patternName: "段階的ニーズ把握アプローチ",
          successCount: 245,
          applicabilityScore: 92,
        },
        {
          patternId: "pattern_002",
          patternName: "ROI重視型提案",
          successCount: 198,
          applicabilityScore: 88,
        },
        {
          patternId: "pattern_003",
          patternName: "競合対比分析型提案",
          successCount: 156,
          applicabilityScore: 85,
        },
      ],
    };

    // 生成済みの推奨内容
    const recommendationData = {
      dealId: "deal_12345",
      customerId: "customer_67890",
      recommendedApproach: "顧客の経営課題に対する段階的なアプローチ",
      trustScore: 85,
      timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
    };

    // Act: explainRecommendationReasoning を呼び出す（失敗状態）
    const result = await explainRecommendationReasoning(
      recommendationData,
      failingAIEngine,
      recommendationPatternMaster
    );

    // Assert: 簡略版根拠が返される
    expect(result).toEqual({
      success: true,
      hasDetailedExplanation: false,
      simplifiedReasoning: {
        topPattern: {
          patternId: "pattern_001",
          patternName: "段階的ニーズ把握アプローチ",
          successCount: 245,
          applicabilityScore: 92,
        },
        alternativePatterns: [
          {
            patternId: "pattern_002",
            patternName: "ROI重視型提案",
            successCount: 198,
            applicabilityScore: 88,
          },
          {
            patternId: "pattern_003",
            patternName: "競合対比分析型提案",
            successCount: 156,
            applicabilityScore: 85,
          },
        ],
        message: "推奨根拠の詳細説明は一時的に利用できませんが、過去の成功パターンに基づいた提案内容を表示しています。",
      },
      recommendation: {
        dealId: "deal_12345",
        customerId: "customer_67890",
        recommendedApproach: "顧客の経営課題に対する段階的なアプローチ",
        trustScore: 85,
      },
      errorHandled: true,
      displayableToUser: true,
    });

    // Assert: AIEngine の explainRecommendationReasoning が呼び出されたことを確認
    expect(failingAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationData
    );

    // Assert: エラーメッセージは返されず、推奨内容は利用可能
    expect(result.success).toBe(true);
    expect(result.displayableToUser).toBe(true);
    expect(result.recommendation.recommendedApproach).toBe(
      "顧客の経営課題に対する段階的なアプローチ"
    );
  });
});