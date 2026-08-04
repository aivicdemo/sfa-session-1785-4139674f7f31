import { extractSuccessPattern } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-2314: 過去商談データが1件のとき成功パターンとして記録される", () => {
    // Arrange: モック AIRecommendationEngine スタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          {
            patternId: "pat_001",
            customerIndustry: "製造業",
            dealAmount: 5000000,
            proposalApproach: "技術デモ",
            successFlag: true,
            matchScore: 95,
          },
        ],
        totalMatches: 1,
      }),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 過去商談データ（1件）
    const pastDealData = {
      dealId: "deal_001",
      customerIndustry: "製造業",
      dealAmount: 5000000,
      proposalApproach: "技術デモ",
      closedWon: true,
      recordedAt: new Date("2024-01-15T10:00:00Z"),
    };

    // Act: 成功パターン抽出・照合ロジック実行
    const result = extractSuccessPattern(pastDealData, mockAIEngine);

    // Assert: 抽出された成功パターンが推奨パターンマスタに正確に記録されたか確認
    expect(result).toEqual({
      patternId: expect.stringMatching(/^pat_\d+$/),
      customerIndustry: "製造業",
      dealAmount: 5000000,
      proposalApproach: "技術デモ",
      successFlag: true,
      recordedAt: expect.any(Date),
      sourceCount: 1,
    });

    // Assert: 記録内容の詳細検証
    expect(result.customerIndustry).toBe("製造業");
    expect(result.dealAmount).toBe(5000000);
    expect(result.proposalApproach).toBe("技術デモ");
    expect(result.successFlag).toBe(true);
    expect(result.sourceCount).toBe(1);
    expect(result.patternId).toBeTruthy();
    expect(result.recordedAt).toBeInstanceOf(Date);
  });
});