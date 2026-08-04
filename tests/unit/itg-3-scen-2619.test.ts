import { evaluatePatternRelevanceForRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2619: [normal] 推奨内容の根拠表示機能 - 推奨提案アプローチの根拠として、顧客属性の一致度が0%である場合、その旨が表示される
  test("顧客属性一致度0%の場合、根拠説明に明示的な警告表記と条件付き説明文が表示されること", () => {
    // Arrange: テスト用の顧客属性データ（業界、企業規模、購買予算、決定者層など）
    const customerAttributes = {
      industry: "金融サービス",
      companySize: "大企業（1000名以上）",
      purchaseBudget: 5000000,
      decisionMaker: "CFO",
      paymentCycle: "月次",
    };

    // テスト用の過去成功商談パターンデータ（新規案件の顧客属性と一致する項目がないよう設定）
    const pastSuccessPattern = {
      industry: "製造業",
      companySize: "中堅企業（100-500名）",
      purchaseBudget: 1000000,
      decisionMaker: "購買部長",
      paymentCycle: "四半期",
    };

    // AIRecommendationEngineのスタブを構成
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチ案",
        confidenceScore: 35,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([pastSuccessPattern]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0,
        attributeMatchPercentage: 0,
        matchedAttributes: [],
        unmatchedAttributes: [
          "industry",
          "companySize",
          "purchaseBudget",
          "decisionMaker",
          "paymentCycle",
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText:
          "顧客属性の一致度：0%。提示される提案アプローチは過去の成功パターンとの直接的な属性マッチングには基づいていません。このシナリオではAIエージェントが推奨内容を生成する際、過去の類似事例からの直接的な転用ではなく、顧客のニーズと市場状況の分析に基づいています。",
        warningLevel: "high",
        attributeMatchDetails: {
          matchPercentage: 0,
          message:
            "顧客属性一致度：0%。属性マッチがない状況での推奨です。",
        },
      }),
    };

    // Act: 推奨内容の生成と根拠表示を実行
    const result = evaluatePatternRelevanceForRecommendation(
      customerAttributes,
      pastSuccessPattern,
      mockAIRecommendationEngine
    );

    // Assert: 根拠説明に明示的な警告表記と条件付き説明文が含まれていることを検証
    expect(result).toEqual({
      recommendationId: expect.any(String),
      customerAttributes: customerAttributes,
      patternRelevance: {
        matchPercentage: 0,
        relevanceScore: 0,
      },
      reasoningDisplay: {
        primaryText:
          "顧客属性の一致度：0%。提示される提案アプローチは過去の成功パターンとの直接的な属性マッチングには基づいていません。このシナリオではAIエージェントが推奨内容を生成する際、過去の類似事例からの直接的な転用ではなく、顧客のニーズと市場状況の分析に基づいています。",
        warningLabel: "顧客属性一致度：0%",
        conditionalMessage:
          "提示される提案アプローチは過去の成功パターンとの直接的な属性マッチングには基づいていません",
        warningLevel: "high",
      },
      visualIndicator: {
        color: "#ff6b6b",
        icon: "warning",
      },
    });

    // 推奨内容の根拠表示セクションの検証
    expect(result.reasoningDisplay.warningLabel).toBe(
      "顧客属性一致度：0%"
    );
    expect(result.reasoningDisplay.conditionalMessage).toContain(
      "過去の成功パターン"
    );
    expect(result.reasoningDisplay.conditionalMessage).toContain(
      "属性マッチング"
    );
    expect(result.reasoningDisplay.warningLevel).toBe("high");
    expect(result.visualIndicator.color).toBe("#ff6b6b");
  });
});