import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨根拠データの提示機能 - 成功パターン0件時の振る舞い", () => {
  test("SCEN-885: 成功パターン抽出データが0件のとき推奨根拠が表示されない", async () => {
    // Arrange: AIRecommendationEngineのモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // findSimilarPatterns が空配列を返すよう設定
    mockAIEngine.findSimilarPatterns.mockResolvedValue([]);

    // テスト用の新規案件データ
    const newDealData = {
      customer_name: "新規顧客A",
      industry: "製造業",
      company_size: "中堅企業",
      budget_amount: 5000000,
      business_challenge: "生産効率化",
      sales_stage: "初期接触",
      recommendation_engine: mockAIEngine,
    };

    // Act: 推奨根拠データ提示機能を呼び出し
    const result = await generateRecommendation(newDealData);

    // Assert: 成功パターン抽出処理が0件を受け取ったことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith({
      industry: "製造業",
      company_size: "中堅企業",
      business_challenge: "生産効率化",
    });

    // 推奨結果が返される
    expect(result).toBeDefined();

    // 成功パターンが0件のため、推奨根拠説明は生成されない
    expect(result.reasoning_explanation).toBeUndefined();

    // パターンマッチスコアは表示されない
    expect(result.pattern_match_score).toBeUndefined();

    // 参考事例リストが空
    expect(result.reference_examples).toEqual([]);

    // 適用可能性スコアは計算されない
    expect(result.applicability_score).toBeUndefined();

    // 空状態メッセージが表示される
    expect(result.empty_state_message).toBe("該当する成功パターンがありません");

    // explainRecommendationReasoning は呼び出されない
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    // evaluatePatternRelevance は呼び出されない
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});