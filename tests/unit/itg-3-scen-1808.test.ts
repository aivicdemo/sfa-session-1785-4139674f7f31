import { generateRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1808
  test("推奨提案アプローチの根拠が自然言語で説明文として生成される", () => {
    // Arrange: テスト入力データの構成
    const case_input = {
      customer_name: "株式会社ABC",
      industry: "製造業",
      challenge: "生産効率化",
      budget_jpy: 5000000,
      decision_timeline_days: 90,
    };

    // Stub: AIRecommendationEngine の mock 実装
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommended_approach: "提案資料での事例紹介→顧客訪問デモ→カスタマイズ提案",
        confidence_score: 85,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation_text:
          "過去12ヶ月の成功事例分析から、製造業向け同規模案件では事例紹介による信頼構築が初期接触成功率を75%向上させています。段階的なアプローチにより、決定時期3ヶ月の案件では平均成約期間を42日短縮しています。",
      }),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 推奨生成と根拠説明の実行
    return generateRecommendationWithReasoning(case_input, mock_ai_engine).then(
      (result) => {
        // Assert: 根拠説明が正確に返却されることを検証
        expect(result.reasoning_explanation).toBe(
          "過去12ヶ月の成功事例分析から、製造業向け同規模案件では事例紹介による信頼構築が初期接触成功率を75%向上させています。段階的なアプローチにより、決定時期3ヶ月の案件では平均成約期間を42日短縮しています。"
        );

        // Assert: 推奨アプローチが返却されることを検証
        expect(result.recommended_approach).toBe(
          "提案資料での事例紹介→顧客訪問デモ→カスタマイズ提案"
        );

        // Assert: 信頼度スコアが返却されることを検証
        expect(result.confidence_score).toBe(85);

        // Assert: AIエンジンのメソッドが正確に呼び出されたことを検証
        expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
          case_input
        );
        expect(
          mock_ai_engine.explainRecommendationReasoning
        ).toHaveBeenCalledWith({
          recommended_approach: "提案資料での事例紹介→顧客訪問デモ→カスタマイズ提案",
          confidence_score: 85,
        });
      }
    );
  });
});