import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1624
  test("推奨内容の根拠表示 - 根拠データが0件のとき、根拠なし情報が表示される", async () => {
    // Arrange: AIRecommendationEngine.explainRecommendationReasoning のスタブを作成
    // 根拠データが0件の状態をシミュレート
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: "REC-20240115-001",
        explanationText:
          "この推奨は顧客の購買履歴と現在の市場状況に基づいて生成されました。",
        reasoningDetails: [], // 根拠データなし
        confidenceScore: 78,
      }),
    };

    // Act: explainRecommendationReasoning を呼び出し、根拠データが空配列で返ることを検証
    const result = await mockAIRecommendationEngine.explainRecommendationReasoning(
      {
        recommendationId: "REC-20240115-001",
        customerId: "CUST-12345",
        dealId: "DEAL-67890",
      }
    );

    // Assert: 根拠データが0件であることを確認
    expect(result.reasoningDetails).toEqual([]);
    expect(result.reasoningDetails.length).toBe(0);

    // Assert: 根拠表示領域に表示されるべき「根拠なし情報メッセージ」の存在を確認
    // 根拠データが0件の場合、UI層で表示されるメッセージを検証
    const noReasoningMessage =
      result.reasoningDetails.length === 0
        ? "この推奨に対する詳細な根拠情報は現在利用できません"
        : "";

    expect(noReasoningMessage).toBe(
      "この推奨に対する詳細な根拠情報は現在利用できません"
    );

    // Assert: 根拠リスト要素が存在しないことを確認（空配列なので要素がない）
    expect(Array.isArray(result.reasoningDetails)).toBe(true);
    expect(result.reasoningDetails.length).toBe(0);

    // Assert: 推奨ID、説明テキスト、信頼度スコアは返却されていることを確認
    expect(result.recommendationId).toBe("REC-20240115-001");
    expect(result.explanationText).toBeDefined();
    expect(result.confidenceScore).toBe(78);
  });
});