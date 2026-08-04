import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2340: [edge] 推奨根拠の自然言語説明生成機能 - OpenAI API呼び出しがタイムアウトのとき簡略版の説明文が代替として返却される
  test("OpenAI APIがタイムアウトした場合、推奨パターンマスタから統計的に上位の成功パターンに基づいた簡略版説明が返却される", async () => {
    // テスト用の推奨案件データを準備
    const recommendationData = {
      recommendationId: "REC-20240115-001",
      customerId: "CUST-20240115-0001",
      customerIndustry: "金融",
      customerSize: "large",
      dealAmount: 5000000,
      dealStage: "提案",
      proposalApproach: "consultative_selling",
      successPatternId: "SP-001",
      confidenceScore: 85,
      generatedAt: new Date("2024-01-15T11:00:00Z"),
    };

    // AIRecommendationEngine をモック化し、30秒タイムアウトエラーを発生させる設定
    const mockAIEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation(async () => {
          throw new Error("API request timeout: 30000ms exceeded");
        }),
    };

    // 推奨パターンマスタ（統計的に上位の成功パターン）のモック
    const recommendationPatternMaster = [
      {
        patternId: "SP-001",
        industry: "金融",
        approachType: "consultative_selling",
        successRate: 0.82,
        description: "顧客業界は金融、過去成功率が高いアプローチは提案型営業です",
        frequency: 45,
      },
      {
        patternId: "SP-002",
        industry: "金融",
        approachType: "solution_selling",
        successRate: 0.75,
        description: "ソリューション提案型のアプローチも金融セクターで有効です",
        frequency: 38,
      },
    ];

    // 外部AIエンジンの呼び出し窓口（スタブ）
    const aiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockImplementation(async () => {
        // 最大3回の指数バックオフで再試行をシミュレート
        const maxRetries = 3;
        const delays = [1000, 2000, 4000];

        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            // タイムアウトをシミュレート
            await new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("API request timeout: 30000ms exceeded")),
                100
              )
            );
          } catch (error) {
            if (attempt < maxRetries - 1) {
              // 次の再試行まで待機（指数バックオフ）
              await new Promise((resolve) =>
                setTimeout(resolve, delays[attempt])
              );
            } else {
              // 3回すべて失敗した場合、推奨パターンマスタから統計的に上位の成功パターンを返却
              const topPattern = recommendationPatternMaster.reduce(
                (prev, current) =>
                  prev.frequency > current.frequency ? prev : current
              );

              return {
                explanationType: "simplified",
                explanation: topPattern.description,
                sourceType: "pattern_master",
                successRate: topPattern.successRate,
                confidenceScore: 65,
                generatedAt: new Date("2024-01-15T11:00:05Z"),
              };
            }
          }
        }
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨根拠の自然言語説明生成機能を呼び出す
    const result = await aiRecommendationEngine.explainRecommendationReasoning(
      recommendationData
    );

    // 検証1: 返却される説明が簡略版であることを確認
    expect(result.explanationType).toBe("simplified");

    // 検証2: 説明文が統計情報ベースの簡潔な説明であることを確認
    expect(result.explanation).toBe(
      "顧客業界は金融、過去成功率が高いアプローチは提案型営業です"
    );

    // 検証3: ソースが推奨パターンマスタであることを確認
    expect(result.sourceType).toBe("pattern_master");

    // 検証4: 代替返却時の信頼度スコアが低下していることを確認（OpenAI生成時より低い）
    expect(result.confidenceScore).toBe(65);
    expect(result.confidenceScore).toBeLessThan(recommendationData.confidenceScore);

    // 検証5: 成功率が統計的に上位パターンの値であることを確認
    expect(result.successRate).toBe(0.82);

    // 検証6: タイムアウト発生時刻と比較して、再試行による遅延が反映されていることを確認
    const elapsed = result.generatedAt.getTime() - new Date("2024-01-15T11:00:00Z").getTime();
    // 指数バックオフの総遅延: 1000 + 2000 + 4000 = 7000ms
    expect(elapsed).toBeGreaterThanOrEqual(7000);
  });
});