import { generateRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-800: 推奨根拠データ生成機能 - 商談条件マッチング度が根拠として営業担当者に提示される", () => {
    // テストデータ準備: サンプル顧客情報と商談条件
    const customerInfo = {
      industry: "IT",
      budget: 5000000,
      implementationTimeline: "3ヶ月以内",
    };

    const dealConditions = {
      proposalContent: "クラウド基盤構築",
      decisionMakers: 2,
    };

    const pastSuccessPatterns = [
      {
        industry: "IT",
        budgetRange: { min: 3000000, max: 8000000 },
        implementationMonths: 3,
        matchingScore: 0.82,
      },
    ];

    // AIRecommendationEngineのスタブ定義
    const aiRecommendationEngineStub = {
      generateRecommendation: jest
        .fn()
        .mockReturnValue({
          proposalApproach: "クラウド基盤構築による業務効率化",
          dealConditionMatchingScore: 0.87,
          confidence: 0.89,
        }),

      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.87,
        averagePastMatchScore: 0.82,
      }),

      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation:
          "予算規模と導入時期が過去成功事例を上回っている",
        matchingPercentage: 87,
        comparisonData: {
          averagePastMatchPercentage: 82,
          difference: 5,
        },
      }),
    };

    // 推奨根拠データ生成機能を呼び出し
    const result = generateRecommendationReasoning(
      customerInfo,
      dealConditions,
      pastSuccessPatterns,
      aiRecommendationEngineStub
    );

    // 期待結果: 根拠データの検証
    // (1) 商談条件マッチング度が数値で表示されること
    expect(result.dealConditionMatchingPercentage).toBe(87);

    // (2) 根拠説明が具体的な理由として自然言語で表示されること
    expect(result.reasoningExplanation).toBe(
      "予算規模と導入時期が過去成功事例を上回っている"
    );

    // (3) 過去成功事例との比較情報が併記されること
    expect(result.comparisonWithPastSuccessPatterns).toEqual({
      averagePastMatchPercentage: 82,
      currentMatchPercentage: 87,
      differencePercentage: 5,
    });

    // 推奨根拠データが定量的スコアと定性的説明の両方を含むことを検証
    expect(result).toHaveProperty("dealConditionMatchingPercentage");
    expect(typeof result.dealConditionMatchingPercentage).toBe("number");
    expect(result).toHaveProperty("reasoningExplanation");
    expect(typeof result.reasoningExplanation).toBe("string");
    expect(result).toHaveProperty("comparisonWithPastSuccessPatterns");
    expect(result.comparisonWithPastSuccessPatterns).toHaveProperty(
      "averagePastMatchPercentage"
    );

    // AIエージェントの各メソッドが正しく呼ばれたことを確認
    expect(
      aiRecommendationEngineStub.evaluatePatternRelevance
    ).toHaveBeenCalledWith(dealConditions, pastSuccessPatterns);
    expect(
      aiRecommendationEngineStub.explainRecommendationReasoning
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        dealConditionMatchingScore: expect.any(Number),
      })
    );
  });
});