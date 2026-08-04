import { evaluateProposalViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案妥当性判定", () => {
  test("SCEN-1257: 参照されるリスク要因が1件のときに判定ロジックが適切に処理される", () => {
    // Arrange: テスト対象の提案妥当性判定機能を初期化する
    const singleRiskFactor = {
      riskFactorId: "RF-001",
      riskType: "顧客予算制約",
      severity: "high",
      relevanceScore: 0.85,
    };

    const dealCondition = {
      dealId: "DEAL-2024-001",
      customerId: "CUST-100",
      proposalAmount: 5000000,
      customerBudgetLimit: 4000000,
      riskFactors: [singleRiskFactor],
      customerIndustry: "製造業",
      dealStage: "提案段階",
    };

    // AIRecommendationEngineのスタブを構成
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
        applicabilityLevel: "high",
        matchedPatterns: 1,
      }),
    };

    // Act: 判定処理を実行
    const judgmentResult = evaluateProposalViability(dealCondition, mockAIEngine);

    // Assert: 返却された判定結果オブジェクトを検証
    // (1) リスク要因の参照数が1と記録されていること
    expect(judgmentResult.referencedRiskFactorCount).toBe(1);

    // (2) 判定ロジックが単一要因に対する重要度評価を完了していること
    expect(judgmentResult.severityEvaluationCompleted).toBe(true);

    // (3) 妥当性スコアが0から1の範囲で計算されていること
    expect(typeof judgmentResult.viabilityScore).toBe("number");
    expect(judgmentResult.viabilityScore).toBeGreaterThanOrEqual(0.0);
    expect(judgmentResult.viabilityScore).toBeLessThanOrEqual(1.0);

    // (4) 処理がエラーなく完了していることを確認
    expect(judgmentResult.processingCompleted).toBe(true);

    // (5) エラーフラグやエッジケース警告が含まれていないこと
    expect(judgmentResult.hasError).toBe(false);
    expect(judgmentResult.edgeCaseWarning).toBeUndefined();

    // (6) 単一要因に対する重要度評価スコアが計算されていること
    expect(judgmentResult.riskSeverityScore).toBe(0.85);

    // (7) 処理タイムアウトが発生していないこと
    expect(judgmentResult.processingTimeoutOccurred).toBe(false);
  });
});