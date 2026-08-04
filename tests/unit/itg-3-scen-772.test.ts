import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-772: AIRecommendationEngine.generateRecommendation が3回の再試行を超えて失敗したとき、キャッシュされた過去推奨が代替表示される", async () => {
    // Arrange: AIRecommendationEngine のスタブを準備し、毎回エラーを投げるよう設定
    let callCount = 0;
    const failingAIEngine = {
      generateRecommendation: jest.fn(async () => {
        callCount++;
        throw new Error("API_FAILURE");
      }),
    };

    // 推奨パターンマスタのキャッシュデータ
    const cachedRecommendationPatterns = [
      {
        id: "pattern_001",
        customerIndustry: "manufacturing",
        approachName: "Custom Manufacturing Solution",
        confidence: 78,
      },
      {
        id: "pattern_002",
        customerIndustry: "manufacturing",
        approachName: "Industry Standard Approach",
        confidence: 65,
      },
    ];

    // 新規案件の顧客・商談条件
    const dealInput = {
      customerId: "cust_123",
      customerName: "Acme Manufacturing Corp",
      industry: "manufacturing",
      companySize: 500,
      dealAmount: 150000,
      dealStage: "initial_contact",
    };

    // Act: generateRecommendation を呼び出し（3回の再試行上限を超えて失敗）
    const result = await generateRecommendation(
      dealInput,
      failingAIEngine,
      cachedRecommendationPatterns
    );

    // Assert 1: AIエンジンへの呼び出しが正確に3回であることを確認
    expect(callCount).toBe(3);
    expect(failingAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    // Assert 2: 戻り値が代替表示用のキャッシュデータを含むことを確認
    expect(result).toEqual({
      status: "fallback",
      message: "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      recommendations: cachedRecommendationPatterns,
      isCached: true,
    });

    // Assert 3: 代替表示のレコメンデーションが正しい形式を持つことを確認
    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0]).toEqual({
      id: "pattern_001",
      customerIndustry: "manufacturing",
      approachName: "Custom Manufacturing Solution",
      confidence: 78,
    });
    expect(result.recommendations[1]).toEqual({
      id: "pattern_002",
      customerIndustry: "manufacturing",
      approachName: "Industry Standard Approach",
      confidence: 65,
    });

    // Assert 4: キャッシュフラグが正しく設定されていることを確認
    expect(result.isCached).toBe(true);
    expect(result.status).toBe("fallback");
  });
});