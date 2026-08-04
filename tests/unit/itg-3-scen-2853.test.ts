import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2853
  test("改善指導優先度決定機能 - 乖離度が低く成約実績との相関が高い営業担当者に対して、改善指導の優先度が低く設定される", () => {
    // テストデータのセットアップ
    const employeeEMP001Data = {
      employeeId: "EMP-001",
      divergencePercentage: 15,
      dealCountPast12Months: 85,
      contractRate: 0.42,
      departmentAverageContractRate: 0.35,
    };

    const employeeEMP002Data = {
      employeeId: "EMP-002",
      divergencePercentage: 75,
      dealCountPast12Months: 30,
      contractRate: 0.28,
      departmentAverageContractRate: 0.35,
    };

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((dealData: any) => {
        if (dealData.employeeId === "EMP-001") {
          return {
            applicabilityScore: 0.88,
            employeeId: "EMP-001",
          };
        } else if (dealData.employeeId === "EMP-002") {
          return {
            applicabilityScore: 0.42,
            employeeId: "EMP-002",
          };
        }
        return { applicabilityScore: 0.5, employeeId: dealData.employeeId };
      }),
    };

    // EMP-001の改善指導優先度を算出
    const priorityEMP001 = evaluatePatternRelevance(
      employeeEMP001Data,
      mockAIRecommendationEngine
    );

    // AIRecommendationEngineが正確に1回呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(
      1
    );

    // EMP-002の改善指導優先度を算出
    mockAIRecommendationEngine.evaluatePatternRelevance.mockClear();
    const priorityEMP002 = evaluatePatternRelevance(
      employeeEMP002Data,
      mockAIRecommendationEngine
    );

    // AIRecommendationEngineが正確に1回呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(
      1
    );

    // EMP-001の優先度スコアが20以下であることを検証
    expect(priorityEMP001.priorityScore).toBeLessThanOrEqual(20);

    // EMP-001の優先度レベルが『低』であることを検証
    expect(priorityEMP001.priorityLevel).toBe("low");

    // EMP-001の改善指導優先度がEMP-002より低いことを数値で比較
    expect(priorityEMP001.priorityScore).toBeLessThan(priorityEMP002.priorityScore);

    // EMP-002の優先度が高いことを確認
    expect(priorityEMP002.priorityScore).toBeGreaterThan(priorityEMP001.priorityScore);
  });
});