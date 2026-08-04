import { displayRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-602
  test("推奨内容の根拠表示機能 - 提案アプローチが1件のみのとき根拠が表示される", () => {
    // Arrange: AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        approach: "顧客の課題分析に基づいた段階的提案",
        confidenceScore: 85,
        patterns: [
          {
            patternId: "pattern-001",
            description: "同業種での成約事例",
            matchScore: 85,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          caseId: "case-12345",
          industry: "製造業",
          challenge: "生産効率化",
          approachUsed: "段階的提案",
          result: "成約",
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation:
          "過去成功事例との類似度：85%、同業種での成約実績：12件、提案所要期間：2週間",
        baseData: {
          similaritySocre: 85,
          successCaseCount: 12,
          estimatedPeriodDays: 14,
        },
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 85,
        isApplicable: true,
      }),
    };

    const customerInfo = {
      industry: "製造業",
      challenge: "生産効率化",
      budget: 5000000,
      companySize: "large",
    };

    const dealCondition = {
      dealId: "deal-001",
      customerId: "customer-001",
      stage: "initial_proposal",
      proposalType: "solution_proposal",
    };

    // Act: 推奨内容表示処理を実行
    const result = displayRecommendationWithReasoning(
      customerInfo,
      dealCondition,
      mockAIEngine
    );

    // Assert: 推奨内容が1件表示され、根拠情報が含まれていることを確認
    expect(result).toBeDefined();
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].approach).toBe(
      "顧客の課題分析に基づいた段階的提案"
    );

    // 根拠セクションが表示されていることを確認
    expect(result.recommendations[0].reasoning).toBeDefined();
    expect(result.recommendations[0].reasoning.explanation).toMatch(
      /過去成功事例との類似度.*85%/
    );
    expect(result.recommendations[0].reasoning.explanation).toMatch(
      /同業種での成約実績.*12件/
    );
    expect(result.recommendations[0].reasoning.explanation).toMatch(
      /提案所要期間.*2週間/
    );

    // AIエージェントのメソッドが正しく呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealCondition
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      "顧客の課題分析に基づいた段階的提案",
      expect.any(Object)
    );

    // 信頼度スコアが0～100の範囲内であることを確認
    expect(result.recommendations[0].confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendations[0].confidenceScore).toBeLessThanOrEqual(100);
    expect(result.recommendations[0].confidenceScore).toBe(85);

    // 根拠データが正しく含まれていることを確認
    expect(result.recommendations[0].reasoning.baseData).toEqual({
      similarityScore: 85,
      successCaseCount: 12,
      estimatedPeriodDays: 14,
    });
  });
});