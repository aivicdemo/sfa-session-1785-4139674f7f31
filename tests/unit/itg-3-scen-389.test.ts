import { verifyRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 推論精度検証", () => {
  // SCEN-389
  test("検証期間が年度をまたぐとき、双方の年度のデータを集計対象に含める", () => {
    // 準備: AIRecommendationEngineのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 2024年度のデータ: 2024年4月1日〜2025年3月31日に完了した商談10件
    const fy2024Deals = Array.from({ length: 10 }, (_, i) => ({
      dealId: `DEAL_2024_${i + 1}`,
      completionDate: new Date(`2024-${String((i % 12) + 4).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}T00:00:00Z`),
      successPatternMatchScore: 0.82,
      fiscalYear: 2024,
    }));

    // 2025年度のデータ: 2025年4月1日〜2025年4月20日に完了した商談5件
    const fy2025Deals = Array.from({ length: 5 }, (_, i) => ({
      dealId: `DEAL_2025_${i + 1}`,
      completionDate: new Date(`2025-04-${String(i + 1).padStart(2, "0")}T00:00:00Z`),
      successPatternMatchScore: 0.75,
      fiscalYear: 2025,
    }));

    const allDeals = [...fy2024Deals, ...fy2025Deals];

    mockAIEngine.findSimilarPatterns.mockResolvedValue(allDeals);

    const verificationPeriodStart = new Date("2024-03-15T00:00:00Z");
    const verificationPeriodEnd = new Date("2025-04-20T23:59:59Z");

    const result = verifyRecommendationAccuracy(
      {
        verificationPeriodStart,
        verificationPeriodEnd,
        aiEngine: mockAIEngine,
      }
    );

    // 期待値の計算
    const expectedTotalDealCount = 15;
    const expectedAverageScore = (10 * 0.82 + 5 * 0.75) / 15;
    const expectedAverageScoreRounded = Math.round(expectedAverageScore * 10000) / 10000;

    // 集計結果の検証: 総商談数が15件
    expect(result.totalDealCount).toBe(expectedTotalDealCount);

    // 全体の平均スコアが0.8067
    expect(Math.round(result.overallAverageScore * 10000) / 10000).toBe(expectedAverageScoreRounded);

    // 年度別の内訳が記録されていることを確認
    expect(result.byFiscalYear).toBeDefined();
    expect(result.byFiscalYear).toHaveLength(2);

    // 2024年度の集計情報
    const fy2024Result = result.byFiscalYear.find((fy) => fy.fiscalYear === 2024);
    expect(fy2024Result).toBeDefined();
    expect(fy2024Result!.dealCount).toBe(10);
    expect(fy2024Result!.averageScore).toBe(0.82);

    // 2025年度の集計情報
    const fy2025Result = result.byFiscalYear.find((fy) => fy.fiscalYear === 2025);
    expect(fy2025Result).toBeDefined();
    expect(fy2025Result!.dealCount).toBe(5);
    expect(fy2025Result!.averageScore).toBe(0.75);

    // 年度をまたぐ期間指定が正しく反映されたことを確認
    expect(result.verificationPeriodStart).toEqual(verificationPeriodStart);
    expect(result.verificationPeriodEnd).toEqual(verificationPeriodEnd);
    expect(result.spansMultipleFiscalYears).toBe(true);
  });
});