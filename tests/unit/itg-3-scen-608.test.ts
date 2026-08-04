import { findSimilarPatterns, evaluatePatternRelevance, generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動抽出・提案アプローチ推奨機能", () => {
  // SCEN-608
  test("新規顧客が複数の過去成功パターンに部分マッチするとき適用可能なアプローチが複数件推奨される", async () => {
    // テストデータセットアップ：新規顧客案件情報
    const newCustomerCase = {
      industry: "IT",
      budgetAmount: 5000000,
      decisionMakers: 3,
      implementationPeriodMonths: 3,
    };

    // 過去成功パターンマスタのスタブデータ
    const successPatternMasterStub = [
      {
        patternId: "PATTERN_A",
        industry: "IT",
        budgetMin: 3000000,
        budgetMax: 7000000,
        decisionMakersMin: 2,
        decisionMakersMax: 4,
        implementationMonthsMin: 2,
        implementationMonthsMax: 4,
        approachName: "段階的導入アプローチ",
      },
      {
        patternId: "PATTERN_B",
        industry: "IT",
        budgetMin: 10000000,
        budgetMax: Infinity,
        decisionMakersMin: 5,
        decisionMakersMax: Infinity,
        implementationMonthsMin: 6,
        implementationMonthsMax: Infinity,
        approachName: "エンタープライズ統合導入アプローチ",
      },
      {
        patternId: "PATTERN_C",
        industry: "通信",
        budgetMin: 4500000,
        budgetMax: 5500000,
        decisionMakersMin: 3,
        decisionMakersMax: 3,
        implementationMonthsMin: 3,
        implementationMonthsMax: 3,
        approachName: "部門別試行展開アプローチ",
      },
    ];

    // AIRecommendationEngineのfindSimilarPatternsスタブ
    const findSimilarPatternsStub = jest.fn().mockResolvedValue([
      {
        patternId: "PATTERN_A",
        approachName: "段階的導入アプローチ",
        relevanceScore: 0.85,
      },
      {
        patternId: "PATTERN_C",
        approachName: "部門別試行展開アプローチ",
        relevanceScore: 0.78,
      },
      {
        patternId: "PATTERN_B",
        approachName: "エンタープライズ統合導入アプローチ",
        relevanceScore: 0.42,
      },
    ]);

    // AIRecommendationEngineのevaluatePatternRelevanceスタブ
    const evaluatePatternRelevanceStub = jest
      .fn()
      .mockImplementation((patternId: string) => {
        const scoreMap: Record<string, number> = {
          PATTERN_A: 0.85,
          PATTERN_B: 0.42,
          PATTERN_C: 0.78,
        };
        return {
          patternId,
          isApplicable: (scoreMap[patternId] ?? 0) >= 0.7,
          relevanceScore: scoreMap[patternId] ?? 0,
        };
      });

    // AIRecommendationEngineのgenerateRecommendationスタブ
    const generateRecommendationStub = jest.fn().mockResolvedValue({
      recommendations: [
        {
          rank: 1,
          approachName: "段階的導入アプローチ",
          relevanceScore: 0.85,
          basePatternId: "PATTERN_A",
          reasoningExplanation:
            "貴社のIT業種、500万円の予算規模、3名の意思決定者、3ヶ月の導入時期は、過去の成功事例パターンAと高度に合致しています。段階的なフェーズに分けた導入により、リスク軽減と組織適応を促進できます。",
        },
        {
          rank: 2,
          approachName: "部門別試行展開アプローチ",
          relevanceScore: 0.78,
          basePatternId: "PATTERN_C",
          reasoningExplanation:
            "貴社の3名の意思決定者と3ヶ月の導入時期は、過去の成功事例パターンCと合致しています。まず一部の部門で試行展開してから全社展開することで、導入効果を検証してからスケールできます。",
        },
      ],
    });

    // 実際の関数呼び出し（スタブを使用）
    const result = await generateRecommendation(
      newCustomerCase,
      generateRecommendationStub,
      findSimilarPatternsStub,
      evaluatePatternRelevanceStub
    );

    // アサーション：推奨リストの検証
    expect(result.recommendations).toHaveLength(2);

    // 推奨1：段階的導入アプローチ
    expect(result.recommendations[0].approachName).toBe("段階的導入アプローチ");
    expect(result.recommendations[0].relevanceScore).toBe(0.85);
    expect(result.recommendations[0].basePatternId).toBe("PATTERN_A");
    expect(result.recommendations[0].reasoningExplanation).toContain(
      "段階的なフェーズに分けた導入"
    );

    // 推奨2：部門別試行展開アプローチ
    expect(result.recommendations[1].approachName).toBe(
      "部門別試行展開アプローチ"
    );
    expect(result.recommendations[1].relevanceScore).toBe(0.78);
    expect(result.recommendations[1].basePatternId).toBe("PATTERN_C");
    expect(result.recommendations[1].reasoningExplanation).toContain(
      "試行展開してから全社展開"
    );

    // relevanceScore 0.42のパターンBは含まれていないことを確認
    const patternBRecommendation = result.recommendations.find(
      (rec) => rec.basePatternId === "PATTERN_B"
    );
    expect(patternBRecommendation).toBeUndefined();

    // 各推奨に根拠説明が生成されていることを確認
    result.recommendations.forEach((recommendation) => {
      expect(recommendation.reasoningExplanation).toBeTruthy();
      expect(recommendation.reasoningExplanation.length).toBeGreaterThan(0);
    });
  });
});