import { calculatePriorityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度スコアリング", () => {
  test("SCEN-455: エラー件数がちょうど閾値（10件）の場合、優先度スコアが正しく算出される", () => {
    // テストデータの準備：エラー件数が正確に10件（閾値）の案件データ
    const targetCase = {
      caseId: "CASE-20250801-001",
      customerName: "テスト顧客A",
      industry: "製造業",
      dealAmount: 5000000,
      proposalApproach: "顧客の生産効率改善を主軸とした段階的導入案",
      errorCount: 10, // 閾値と同一
      dataQualityScore: 85,
      aiRecommendationAccuracy: 0.92,
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const errorThreshold = 10;

    // AIRecommendationEngine のスタブを準備
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationType: "standard",
        confidenceScore: 0.88,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "PATTERN-001",
          matchScore: 0.85,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: "過去の類似案件データに基づく推奨",
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.90,
      }),
    };

    // 優先度スコアリング関数を呼び出し
    const calculatedScore = calculatePriorityScore(
      targetCase.errorCount,
      errorThreshold,
      targetCase.dataQualityScore,
      targetCase.aiRecommendationAccuracy
    );

    // 仕様に基づいた期待スコア値の計算
    // スコア計算式: (100 - (errorCount / threshold * 20)) * (dataQuality / 100) * (aiAccuracy)
    // = (100 - (10 / 10 * 20)) * (85 / 100) * 0.92
    // = (100 - 20) * 0.85 * 0.92
    // = 80 * 0.85 * 0.92
    // = 62.56
    const expectedScore = 62.56;

    // アサーション：スコア値が期待値と一致していることを確認
    expect(calculatedScore).toBe(expectedScore);

    // 追加検証：返却値が正の数値かつ0～100の範囲内であることを確認
    expect(calculatedScore).toBeGreaterThanOrEqual(0);
    expect(calculatedScore).toBeLessThanOrEqual(100);

    // スタブが呼び出されていないことを確認（この関数は純粋計算であるため）
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});