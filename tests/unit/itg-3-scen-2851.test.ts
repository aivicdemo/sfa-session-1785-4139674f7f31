import { determinePriorityForSalesCoach } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2851: [normal] 改善指導優先度決定機能 - 乖離度が高く成約実績との相関が低い営業担当者に対して、改善指導の優先度が最高に設定される", () => {
    // テストデータ: 営業担当者レコード
    const salesPersonId = "SALES-001";
    const deviationDegree = 0.85; // 乖離度（高値、0～1の正規化スケール）
    const contractResultsPast12Months = 5; // 過去12ヶ月の成約実績
    const proposalCountPast12Months = 50; // 過去12ヶ月の提案件数
    const actualContractRate = contractResultsPast12Months / proposalCountPast12Months; // 10%
    const industryAverageContractRate = 0.25; // 業界平均成約率 25%
    const correlationScoreWithContractResults = 0.2; // 成約実績との相関スコア（0.2以下＝低相関）

    // AIRecommendationEngineのモック
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "PATTERN-001",
          successRate: 0.45,
          correlationScore: 0.15,
        },
        {
          patternId: "PATTERN-002",
          successRate: 0.52,
          correlationScore: 0.18,
        },
        {
          patternId: "PATTERN-003",
          successRate: 0.48,
          correlationScore: 0.2,
        },
      ]),
    };

    // 入力パラメータ
    const input = {
      salesPersonId: salesPersonId,
      deviationDegree: deviationDegree,
      contractResultsPast12Months: contractResultsPast12Months,
      proposalCountPast12Months: proposalCountPast12Months,
      industryAverageContractRate: industryAverageContractRate,
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    // 改善指導優先度決定機能を実行
    const result = determinePriorityForSalesCoach(input);

    // 期待値計算: 優先度スコア≥0.9の正規化値（最高優先度）
    // 優先度スコア = 乖離度 * 0.5 + (1 - 相関スコア) * 0.5
    // = 0.85 * 0.5 + (1 - 0.2) * 0.5
    // = 0.425 + 0.4
    // = 0.825
    // ただし、乖離度≥0.8かつ相関スコア≤0.3の場合は優先度を最高レベルに引き上げ
    const expectedPriorityLevel = 1; // 最高優先度レベル
    const expectedPriorityScore = 0.9; // 最高優先度スコア（0～1正規化値）

    // 検証1: 優先度レベルが最高（1）に設定されている
    expect(result.priorityLevel).toBe(expectedPriorityLevel);

    // 検証2: 優先度スコアが0.9以上に設定されている
    expect(result.priorityScore).toBeGreaterThanOrEqual(expectedPriorityScore);

    // 検証3: 優先度決定の根拠ログメッセージが記録されている
    expect(result.reasoningLog).toMatch(/乖離度/);
    expect(result.reasoningLog).toMatch(/提案アプローチ/);
    expect(result.reasoningLog).toMatch(/見直し指導/);

    // 検証4: 対象営業担当者IDが正しく記録されている
    expect(result.salesPersonId).toBe(salesPersonId);

    // 検証5: AIエージェントがfindSimilarPatternsメソッドを呼び出している
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();

    // 検証6: 相関スコア情報が結果に含まれている
    expect(result.correlationScore).toBe(correlationScoreWithContractResults);

    // 検証7: 乖離度情報が結果に含まれている
    expect(result.deviationDegree).toBe(deviationDegree);
  });
});