import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2572: [edge] 推奨内容の根拠表示機能 - 根拠の有効期限がちょうど本日のとき、表示される", () => {
    // Setup: モック推奨データの根拠有効期限を本日（2026-08-01）に設定
    const todayDate = "2026-08-01";
    const recommendationId = "REC-20260801-001";

    // AIRecommendationEngine.explainRecommendationReasoning のスタブを設定
    const mockReasoningData = {
      recommendationId: recommendationId,
      explanation:
        "過去の類似案件における顧客属性と商談条件の合致度が高く、提案アプローチの成功率が85%であることが根拠です。",
      reasoningFactors: [
        {
          factorType: "customer_attribute",
          value: "大規模製造業",
          weight: 0.35,
        },
        {
          factorType: "deal_condition",
          value: "予算規模5000万円以上",
          weight: 0.3,
        },
        {
          factorType: "success_pattern",
          value: "標準提案アプローチA",
          weight: 0.35,
        },
      ],
      confidenceScore: 85,
      expirationDate: todayDate,
      isExpired: false,
      isHidden: false,
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() =>
        Promise.resolve(mockReasoningData)
      ),
    };

    // 実行: 推奨IDを指定して根拠表示機能を実行
    return explainRecommendationReasoning(
      recommendationId,
      mockAIEngine
    ).then((result) => {
      // 検証1: DOM上に根拠説明テキストが完全にレンダリングされている
      expect(result.explanation).toBeDefined();
      expect(result.explanation).toContain("類似案件");
      expect(result.explanation).toContain("成功率");

      // 検証2: 根拠の有効期限表示要素に本日日付が表示される
      expect(result.expirationDate).toBe(todayDate);

      // 検証3: 根拠の有効期限がちょうど本日のため isExpired は false
      expect(result.isExpired).toBe(false);

      // 検証4: 根拠の非表示フラグが設定されていない
      expect(result.isHidden).toBe(false);

      // 検証5: 根拠説明テキストの信頼度スコアが0～100のスコアで表示される
      expect(result.confidenceScore).toBe(85);
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(result.confidenceScore).toBeLessThanOrEqual(100);

      // 検証6: 推奨された根拠の根拠要因が正しく構成されている
      expect(result.reasoningFactors).toHaveLength(3);
      expect(result.reasoningFactors[0].factorType).toBe("customer_attribute");
      expect(result.reasoningFactors[0].weight).toBe(0.35);
      expect(result.reasoningFactors[1].factorType).toBe("deal_condition");
      expect(result.reasoningFactors[1].weight).toBe(0.3);
      expect(result.reasoningFactors[2].factorType).toBe("success_pattern");
      expect(result.reasoningFactors[2].weight).toBe(0.35);

      // 検証7: AIRecommendationEngine の explainRecommendationReasoning が正しく呼ばれている
      expect(
        mockAIEngine.explainRecommendationReasoning
      ).toHaveBeenCalledWith(recommendationId);
      expect(
        mockAIEngine.explainRecommendationReasoning
      ).toHaveBeenCalledTimes(1);
    });
  });
});