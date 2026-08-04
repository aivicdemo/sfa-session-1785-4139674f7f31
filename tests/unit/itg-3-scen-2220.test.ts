import { analyzeProposalAndCustomerInteractionPattern } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案内容と顧客対応パターン分析機能", () => {
  // SCEN-2220
  test("顧客対応記録が1件のとき標準プロセスと正常に比較される", () => {
    const pastInteractionRecord = {
      customerName: "A社",
      product: "クラウドサービス",
      successFlag: true,
      transactionDate: "2026-01-15",
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          customerName: "A社",
          product: "クラウドサービス",
          successRate: 0.95,
          similarityScore: 0.95,
        },
      ]),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: "rec_001",
        standardProcess: [
          {
            phase: "ヒアリング",
            approach:
              "初期ヒアリングでコスト削減の定量目標を明確化（A社成功事例参考）",
            basedOnSuccessCase: "A社",
          },
          {
            phase: "課題分析",
            approach:
              "現在のコスト構造を詳細に把握し、クラウド化による削減効果を試算",
            basedOnSuccessCase: "A社",
          },
          {
            phase: "提案",
            approach:
              "削減効果を数値で示した提案資料を作成、経営層への説得を重視",
            basedOnSuccessCase: "A社",
          },
          {
            phase: "フォローアップ",
            approach:
              "導入後の効果測定プロセスを定義し、継続的な改善を支援",
            basedOnSuccessCase: "A社",
          },
        ],
        confidenceScore: 85,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.85,
        isApplicable: true,
      }),
    };

    const newCaseInput = {
      customerName: "B社",
      industry: "同一業種",
      businessChallenge: "コスト削減",
      productType: "クラウドサービス",
    };

    const result = analyzeProposalAndCustomerInteractionPattern(
      newCaseInput,
      [pastInteractionRecord],
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "B社",
        industry: "同一業種",
        businessChallenge: "コスト削減",
      })
    );

    expect(result.standardProcess).toHaveLength(4);
    expect(result.standardProcess[0].phase).toBe("ヒアリング");
    expect(result.standardProcess[1].phase).toBe("課題分析");
    expect(result.standardProcess[2].phase).toBe("提案");
    expect(result.standardProcess[3].phase).toBe("フォローアップ");

    expect(result.standardProcess[0].approach).toContain("A社");
    expect(result.standardProcess[0].approach).toContain("コスト削減");
    expect(result.standardProcess[0].approach).toContain("定量目標");

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(result.applicabilityScore).toBe(0.85);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.8);

    expect(result.similarityScore).toBe(0.95);
    expect(result.confidenceScore).toBe(85);
  });
});