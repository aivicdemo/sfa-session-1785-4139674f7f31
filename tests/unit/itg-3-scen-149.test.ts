import { generateRecommendation, explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-149
  test("推奨内容ごとに複数の根拠が存在する場合に全て表示される", () => {
    const recommendationId = "REC-001";
    const recommendationText = "顧客の購買タイミングは月末が最適です";

    const reasonings = [
      {
        reasoningId: "REASON-001",
        reasoningType: "過去事例参照",
        reasoningContent: "同業他社の購買パターンで月末に集中している事例が確認されました",
      },
      {
        reasoningId: "REASON-002",
        reasoningType: "顧客データ分析",
        reasoningContent: "当該顧客の過去12ヶ月の発注記録から月末の発注頻度が最高です",
      },
      {
        reasoningId: "REASON-003",
        reasoningType: "成功パターンマッチ",
        reasoningContent: "類似規模の顧客で月末提案が80%以上の採用率を達成しています",
      },
    ];

    const stubAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: recommendationId,
        recommendationText: recommendationText,
        reasonings: reasonings,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "当該顧客は月末に購買タイミングが集中しており、これは過去12ヶ月の発注パターン分析と同業他社の購買事例から確認されています。" +
          "さらに、類似規模企業での月末提案における高い採用率（80%以上）からも、このタイミングが最適であると判断されます。"
      ),
    };

    const result = generateRecommendation(stubAIEngine, {
      customerId: "CUST-123",
      dealSize: 5000000,
      industry: "製造業",
    });

    expect(result.recommendationId).toBe(recommendationId);
    expect(result.recommendationText).toBe(recommendationText);
    expect(result.reasonings).toHaveLength(3);

    expect(result.reasonings[0]).toEqual({
      reasoningId: "REASON-001",
      reasoningType: "過去事例参照",
      reasoningContent: "同業他社の購買パターンで月末に集中している事例が確認されました",
    });

    expect(result.reasonings[1]).toEqual({
      reasoningId: "REASON-002",
      reasoningType: "顧客データ分析",
      reasoningContent: "当該顧客の過去12ヶ月の発注記録から月末の発注頻度が最高です",
    });

    expect(result.reasonings[2]).toEqual({
      reasoningId: "REASON-003",
      reasoningType: "成功パターンマッチ",
      reasoningContent: "類似規模の顧客で月末提案が80%以上の採用率を達成しています",
    });

    const explanation = explainRecommendationReasoning(stubAIEngine, recommendationId, reasonings);

    expect(explanation).toBe(
      "当該顧客は月末に購買タイミングが集中しており、これは過去12ヶ月の発注パターン分析と同業他社の購買事例から確認されています。" +
        "さらに、類似規模企業での月末提案における高い採用率（80%以上）からも、このタイミングが最適であると判断されます。"
    );

    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledWith(
      { customerId: "CUST-123", dealSize: 5000000, industry: "製造業" }
    );

    expect(stubAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationId,
      reasonings
    );
  });
});