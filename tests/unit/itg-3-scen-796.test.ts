import { generateRecommendation } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-796: 推奨根拠データ生成機能 - 類似パターンの検索結果が1件のとき、根拠として正常に提示される", () => {
    // Arrange: テスト用の新規案件データを準備
    const newDealData = {
      customer_name: "新規顧客Z",
      industry: "製造業",
      company_size: "中規模",
      budget_range: "500万円～1000万円",
      challenges: ["生産効率化", "コスト削減"],
    };

    // Arrange: 類似パターン1件を返すスタブAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: "PAT-001",
          match_score: 0.87,
          past_customer_name: "顧客A",
          past_customer_industry: "製造業",
          past_customer_size: "中規模",
          past_proposal_approach: "生産効率化向けシステム導入提案",
          past_contracted_result: true,
          past_success_factors: "顧客の既存システムとの連携容易性、段階的な導入スケジュール",
        },
      ]),
      generateRecommendation: jest
        .fn()
        .mockResolvedValue({
          recommendation_id: "REC-001",
          recommended_approach:
            "生産効率化向けシステム導入提案（段階的導入型）",
          rootReason:
            "過去の顧客A（同業界、類似規模）への提案アプローチがマッチスコア0.87で最も類似しており、その際の成功要因は『既存システムとの連携容易性、段階的な導入スケジュール』であるため、現在の案件にも同様のアプローチが適用可能と判断されました",
          confidence_score: 87,
        }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning_text:
          "過去の顧客A（同業界、類似規模）への提案アプローチがマッチスコア0.87で最も類似しており、その際の成功要因は『既存システムとの連携容易性、段階的な導入スケジュール』であるため、現在の案件にも同様のアプローチが適用可能と判断されました",
      }),
    };

    // Act: generateRecommendation()を呼び出し
    const result = generateRecommendation(newDealData, mockAIEngine);

    // Assert: 推奨根拠データが正常に生成されていることを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // Assert: 推奨結果オブジェクトが取得され、rootReasonフィールドが存在することを確認
    expect(result).toHaveProperty("rootReason");
    expect(typeof result.rootReason).toBe("string");

    // Assert: rootReasonに必要な内容が含まれていることを検証
    expect(result.rootReason).toContain("顧客A");
    expect(result.rootReason).toContain("0.87");
    expect(result.rootReason).toContain("既存システムとの連携容易性");
    expect(result.rootReason).toContain("段階的な導入スケジュール");
    expect(result.rootReason).toContain("適用可能");

    // Assert: マッチスコア値が正常な範囲内であることを確認
    expect(result.confidence_score).toBe(87);
    expect(result.confidence_score).toBeGreaterThanOrEqual(85);
    expect(result.confidence_score).toBeLessThanOrEqual(100);

    // Assert: 推奨アプローチが設定されていることを確認
    expect(result).toHaveProperty("recommended_approach");
    expect(result.recommended_approach).toBe(
      "生産効率化向けシステム導入提案（段階的導入型）"
    );
  });
});