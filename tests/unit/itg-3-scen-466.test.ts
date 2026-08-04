import { recommendGuidanceStrategy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム", () => {
  test("SCEN-466: 指導施策推奨機能 - スコアが中水準（41～60点）の場合、定期指導が推奨される", () => {
    // モック化されたAIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(() => 50),
    };

    // 入力: 顧客スコア50点の新規案件データ
    const newDealData = {
      customerId: "CUST-001",
      customerName: "テスト顧客A",
      industry: "製造業",
      companySize: "中堅企業",
      dealValue: 5000000,
      dealPhase: "提案準備",
      customerScore: 50,
    };

    // explainRecommendationReasoningの根拠説明をモック
    const expectedReasoning =
      "過去成功パターンから、この顧客属性では定期的なフォローアップにより提案採用率が65%に達する傾向が確認されています。月1回の定期接触を推奨します。";
    mockAIEngine.explainRecommendationReasoning.mockReturnValue(
      expectedReasoning
    );

    // テスト対象関数を実行
    const result = recommendGuidanceStrategy(newDealData, mockAIEngine);

    // 検証1: 返却されたオブジェクトのtypeフィールドが「定期指導」であること
    expect(result.type).toBe("定期指導");

    // 検証2: 推奨施策に対応する根拠説明が含まれていること
    expect(result.reasoning).toBe(expectedReasoning);

    // 検証3: evaluatePatternRelevanceが呼び出されていること（スコア判定の過程）
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 検証4: explainRecommendationReasoningが呼び出されていること
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // 検証5: 返却オブジェクトの構造確認
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("reasoning");
    expect(result).toHaveProperty("score");
    expect(result.score).toBe(50);
  });
});