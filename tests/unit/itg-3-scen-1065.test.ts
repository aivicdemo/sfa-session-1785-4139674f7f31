import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨内容の生成と説明", () => {
  // SCEN-1065
  test("OpenAI API呼び出し失敗時に内部の推奨パターンマスタから統計的に上位のパターンが返却される", async () => {
    // テスト用のスタブ AIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            // タイムアウト例外をシミュレート
            setTimeout(() => {
              reject(new Error("API timeout"));
            }, 100);
          })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタのテストデータ
    const recommendationPatternMaster = [
      {
        pattern_id: "pattern_A",
        success_count: 150,
        win_rate: 80,
        customer_scale: "large",
        industry: "manufacturing",
        budget_range_min: 50000000,
      },
      {
        pattern_id: "pattern_B",
        success_count: 120,
        win_rate: 75,
        customer_scale: "large",
        industry: "manufacturing",
        budget_range_min: 50000000,
      },
      {
        pattern_id: "pattern_C",
        success_count: 90,
        win_rate: 70,
        customer_scale: "large",
        industry: "manufacturing",
        budget_range_min: 50000000,
      },
    ];

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      customer_scale: "large",
      industry: "manufacturing",
      budget: 50000000,
    };

    // API呼び出し失敗時の再試行ロジック（指数バックオフ）と内部パターンマスタの参照
    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine,
      recommendationPatternMaster,
      {
        maxRetries: 3,
        initialDelayMs: 1000,
        backoffMultiplier: 2,
        timeoutMs: 30000,
      }
    );

    // 期待結果の検証
    // 1. 統計的に上位のパターン（パターンA）が推奨内容として返却されることを確認
    expect(result.recommendedPattern.pattern_id).toBe("pattern_A");
    expect(result.recommendedPattern.success_count).toBe(150);
    expect(result.recommendedPattern.win_rate).toBe(80);

    // 2. 根拠説明が簡略版テキストであることを確認
    expect(result.reasoningExplanation).toBe(
      "過去の成功パターンから推奨しています。詳細な説明は一時的に取得できませんでした。"
    );

    // 3. ユーザー向けメッセージが表示されることを確認
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    // 4. API呼び出しが最大3回試行されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // 5. フォールバック動作が有効であることを確認
    expect(result.isFallbackMode).toBe(true);
  });
});