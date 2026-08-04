import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-398
  test("検証実行時点での比較成功パターンが複数件のとき、全パターンを対象に適用可能性を評価", () => {
    // Setup: 複数の成功パターンマスタデータ
    const similarPatterns = [
      {
        patternId: "A",
        customerScale: "large",
        productCategory: "SaaS",
        contractPeriodMonths: 3,
        patternName: "大企業向けSaaS3ヶ月成約型",
      },
      {
        patternId: "B",
        customerScale: "mid",
        productCategory: "SaaS",
        contractPeriodMonths: 2,
        patternName: "中堅企業向けSaaS2ヶ月成約型",
      },
      {
        patternId: "C",
        customerScale: "large",
        productCategory: "consulting",
        contractPeriodMonths: 4,
        patternName: "大企業向けコンサル4ヶ月成約型",
      },
    ];

    // Setup: 新規案件の検証対象条件
    const newDealConditions = {
      customerScale: "large",
      productCategory: "SaaS",
      budget: 5000000,
    };

    // Setup: AIRecommendationEngine のスタブ
    const mockFindSimilarPatterns = jest.fn().mockReturnValue(similarPatterns);

    const mockEvaluatePatternRelevance = jest
      .fn()
      .mockImplementation((patterns, conditions) => {
        return [
          {
            patternId: "A",
            relevanceScore: 0.92,
            patternName: "大企業向けSaaS3ヶ月成約型",
          },
          {
            patternId: "B",
            relevanceScore: 0.68,
            patternName: "中堅企業向けSaaS2ヶ月成約型",
          },
          {
            patternId: "C",
            relevanceScore: 0.45,
            patternName: "大企業向けコンサル4ヶ月成約型",
          },
        ].sort((a, b) => a.relevanceScore - b.relevanceScore);
      });

    const mockAIEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    // Execute: 推奨ロジック呼び出し
    const result = evaluatePatternRelevance(
      newDealConditions,
      mockAIEngine as any
    );

    // Verify: 戻り値が3件すべてのパターン評価を含むこと
    expect(result).toHaveLength(3);

    // Verify: 各パターンのスコアが正しく評価されていること（昇順でソート済み）
    expect(result[0]).toEqual({
      patternId: "C",
      relevanceScore: 0.45,
      patternName: "大企業向けコンサル4ヶ月成約型",
    });

    expect(result[1]).toEqual({
      patternId: "B",
      relevanceScore: 0.68,
      patternName: "中堅企業向けSaaS2ヶ月成約型",
    });

    expect(result[2]).toEqual({
      patternId: "A",
      relevanceScore: 0.92,
      patternName: "大企業向けSaaS3ヶ月成約型",
    });

    // Verify: スコアが昇順でソートされていること
    expect(result[0].relevanceScore).toBeLessThan(result[1].relevanceScore);
    expect(result[1].relevanceScore).toBeLessThan(result[2].relevanceScore);

    // Verify: AIEngine のメソッドが適切に呼び出されたこと
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledWith(
      newDealConditions,
      mockAIEngine
    );
  });
});