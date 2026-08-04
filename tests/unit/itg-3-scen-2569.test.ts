import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2569: [edge] 推奨内容の根拠表示機能 - 根拠リストが逆順で入力されるとき、登録順でソートされて表示される
  test("根拠リストが逆順で入力されるとき、登録順でソートされて表示される", () => {
    // スタブ: AIRecommendationEngineのexplainRecommendationReasoningメソッド
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: "rec-001",
        reasoningList: [
          {
            reasonId: "reason-5",
            reasonTitle: "根拠5",
            reasonOrder: 5,
            description: "5番目の根拠",
          },
          {
            reasonId: "reason-4",
            reasonTitle: "根拠4",
            reasonOrder: 4,
            description: "4番目の根拠",
          },
          {
            reasonId: "reason-3",
            reasonTitle: "根拠3",
            reasonOrder: 3,
            description: "3番目の根拠",
          },
          {
            reasonId: "reason-2",
            reasonTitle: "根拠2",
            reasonOrder: 2,
            description: "2番目の根拠",
          },
          {
            reasonId: "reason-1",
            reasonTitle: "根拠1",
            reasonOrder: 1,
            description: "1番目の根拠",
          },
        ],
      }),
    };

    // 推奨内容の根拠表示機能を呼び出し
    const inputData = {
      recommendationId: "rec-001",
      customerId: "cust-001",
      dealId: "deal-001",
    };

    const result = explainRecommendationReasoning(
      inputData,
      mockAIEngine
    );

    // 結果が Promise として返される場合の処理
    return result.then((response: any) => {
      // 根拠リストが登録順（reasonOrder昇順）でソートされていることを確認
      const sortedReasoningList = response.reasoningList;

      // 表示順序を配列として抽出
      const displayOrder = sortedReasoningList.map(
        (reason: any) => reason.reasonTitle
      );

      // 期待値: 登録順の昇順 [根拠1, 根拠2, 根拠3, 根拠4, 根拠5]
      const expectedOrder = ["根拠1", "根拠2", "根拠3", "根拠4", "根拠5"];

      // アサーション: 表示順序が期待値と一致することを検証
      expect(displayOrder).toEqual(expectedOrder);

      // 根拠の順序が入力時の逆順から正順に並び替えられていることを確認
      expect(sortedReasoningList[0].reasonOrder).toBe(1);
      expect(sortedReasoningList[1].reasonOrder).toBe(2);
      expect(sortedReasoningList[2].reasonOrder).toBe(3);
      expect(sortedReasoningList[3].reasonOrder).toBe(4);
      expect(sortedReasoningList[4].reasonOrder).toBe(5);
    });
  });
});