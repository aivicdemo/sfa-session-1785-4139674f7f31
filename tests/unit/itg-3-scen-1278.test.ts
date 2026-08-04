import { evaluateProposalViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - 提案妥当性判定", () => {
  test("SCEN-1278: 月をまたぐ商談の期間判定が正確に行われる", () => {
    // テスト対象の商談オブジェクト: 1月28日～2月3日
    const dealData = {
      dealId: "DEAL-001",
      customerId: "CUST-001",
      startDate: new Date("2024-01-28T00:00:00Z"),
      endDate: new Date("2024-02-03T23:59:59Z"),
      customerIndustry: "製造業",
      dealAmount: 5000000,
      productCategory: "ERPシステム",
    };

    // AIRecommendationEngineのスタブ: findSimilarPatternsが月をまたぐパターン情報を返却
    const stubAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "P001",
          patternName: "成功パターン1月",
          periodStartDate: new Date("2024-01-15T00:00:00Z"),
          periodEndDate: new Date("2024-01-31T23:59:59Z"),
          overlapDays: 4,
          matchScore: 0.85,
        },
        {
          patternId: "P002",
          patternName: "成功パターン2月",
          periodStartDate: new Date("2024-02-01T00:00:00Z"),
          periodEndDate: new Date("2024-02-15T23:59:59Z"),
          overlapDays: 3,
          matchScore: 0.82,
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 提案妥当性判定機能を実行
    const result = evaluateProposalViability(dealData, stubAIEngine);

    // 期待値: 月をまたぐ商談期間での期間重複の正確な計算
    // 1月側: 1月28日～1月31日 = 4日間
    // 2月側: 2月1日～2月3日 = 3日間
    expect(result.viabilityScore).toBe(83); // (0.85 * 4 + 0.82 * 3) / 7 ≈ 83.43 → 83
    expect(result.overlapAnalysis).toEqual({
      januaryOverlapDays: 4,
      februaryOverlapDays: 3,
      totalOverlapDays: 7,
      pattern1OverlapDays: 4,
      pattern2OverlapDays: 3,
    });
    expect(result.periodBoundaryDetection).toEqual({
      monthBoundaryDate: "2024-01-31",
      isMonthBoundarySpanning: true,
      dealSpanMonths: 2,
    });
    expect(result.patterns).toHaveLength(2);
    expect(result.patterns[0].patternId).toBe("P001");
    expect(result.patterns[0].overlapDays).toBe(4);
    expect(result.patterns[1].patternId).toBe("P002");
    expect(result.patterns[1].overlapDays).toBe(3);
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealData);
  });
});