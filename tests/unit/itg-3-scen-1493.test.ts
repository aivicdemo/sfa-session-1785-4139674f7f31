import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("購買履歴データ品質判定機能", () => {
  test("SCEN-1493: [edge] 品質スコアが許容閾値ちょうど100でスコアが返される", () => {
    // テスト用の購買履歴データセット（品質スコア計算結果が100.0になるデータ）
    const purchaseHistoryData = {
      customerId: "CUST-001",
      purchaseDate: "2024-01-15",
      productCategory: "ソリューション",
      amount: 500000,
      frequency: "月次",
      completeness: 1.0,
      accuracy: 1.0,
      consistency: 1.0,
      timeliness: 1.0,
    };

    // AIRecommendationEngineのスタブを設定
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        qualityScore: 100.0,
        isAcceptable: true,
        rationale: {
          completenessScore: 1.0,
          accuracyScore: 1.0,
          consistencyScore: 1.0,
          timelinessScore: 1.0,
          supportedPatterns: ["成功パターンA", "成功パターンB"],
        },
      }),
    };

    // 品質判定処理を実行
    const result = evaluatePatternRelevance(
      purchaseHistoryData,
      aiRecommendationEngineStub
    );

    // 返却されたスコア値を検証
    expect(result.qualityScore).toBe(100.0);
    expect(typeof result.qualityScore).toBe("number");

    // 許容閾値判定ロジックを検証（スコア100.0は許容閾値以上）
    expect(result.isAcceptable).toBe(true);

    // スコア100.0に対応する根拠情報が正しく生成されているか確認
    expect(result.rationale).toBeDefined();
    expect(result.rationale.completenessScore).toBe(1.0);
    expect(result.rationale.accuracyScore).toBe(1.0);
    expect(result.rationale.consistencyScore).toBe(1.0);
    expect(result.rationale.timelinessScore).toBe(1.0);
    expect(result.rationale.supportedPatterns).toEqual([
      "成功パターンA",
      "成功パターンB",
    ]);

    // AIRecommendationEngineのスタブが正確に呼び出されたか確認
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      purchaseHistoryData
    );

    // AIサービス呼び出しが1回のみであることを確認
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(
      1
    );
  });
});