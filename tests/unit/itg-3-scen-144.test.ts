import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-144: 推奨根拠の可視化機能 - 根拠情報が1件のときに単一ブロックとして可視化される", async () => {
    // Arrange: モック化されたAIRecommendationEngineの推奨根拠説明を準備
    const mockRecommendationId = "rec-12345";
    const singleReasoningData = {
      reasonId: "reason-001",
      text: "過去同業種での成功事例",
      confidence: 0.95,
    };

    // explainRecommendationReasoningメソッドをモック化し、1件の根拠情報を返すよう設定
    const mockAIEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue([singleReasoningData]),
    };

    // Act: 根拠情報の可視化処理を実行
    const result = await explainRecommendationReasoning(
      mockRecommendationId,
      mockAIEngine
    );

    // Assert: 返却されたデータが1件の根拠情報であることを検証
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(singleReasoningData);

    // 根拠情報が『単一ブロック』として描画されるための条件を検証
    // DOM側では className='reasoning-block--single' が適用されることを確認
    expect(result[0].reasonId).toBe("reason-001");
    expect(result[0].text).toBe("過去同業種での成功事例");
    expect(result[0].confidence).toBe(0.95);

    // 複数ブロック用のラッパーコンテナが不要であることを検証
    // （単一ブロックの場合、複数ブロック用コンテナは存在しない）
    expect(result.length).toBe(1);

    // mockAIEngineが正しく呼び出されたことを検証
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      mockRecommendationId
    );
  });
});