import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-2583: [edge] 過去商談データからの成功パターン抽出機能 - 成功した商談件数が閾値直上のとき、一部が除外される", () => {
    // Arrange: 閾値を10件とし、11件の成功商談データを準備
    const threshold = 10;
    const successPatterns = Array.from({ length: 11 }, (_, index) => ({
      patternId: `pattern_${index + 1}`,
      customerIndustry: "IT",
      customerScale: "mid-market",
      proposalContent: `Proposal ${index + 1}`,
      successFactor: `Factor ${index + 1}`,
      relevanceScore: 100 - index, // スコア: 100, 99, 98, ..., 90 (最後が最低)
      contractDate: new Date("2024-01-15T11:00:00Z").toISOString(),
      dealValue: 500000 + index * 10000,
    }));

    // モック AIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(
        successPatterns.slice(0, threshold) // 最大10件に制限
      ),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 新規案件の顧客・商談条件
    const newDealCondition = {
      customerIndustry: "IT",
      customerScale: "mid-market",
      dealStage: "proposal",
      estimatedValue: 600000,
    };

    // Act: 成功パターン抽出機能を実行
    const result = findSimilarPatterns(newDealCondition, mockAIEngine);

    // Assert
    // 1. 抽出される成功パターンは10件（閾値と同数）であること
    expect(result).toHaveLength(threshold);

    // 2. 返却されるパターンの関連性スコアが高い順に並んでいること
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].relevanceScore).toBeGreaterThanOrEqual(
        result[i + 1].relevanceScore
      );
    }

    // 3. 除外されたパターンがランキング順位で最下位（relevanceスコアが最も低い）のものであること
    const excludedPattern = successPatterns[threshold]; // 11番目のパターン
    const minScoreInResult = Math.min(...result.map((p) => p.relevanceScore));
    expect(excludedPattern.relevanceScore).toBeLessThan(minScoreInResult);

    // 4. 返却されるパターンの詳細情報が含まれていること
    result.forEach((pattern) => {
      expect(pattern).toHaveProperty("patternId");
      expect(pattern).toHaveProperty("customerIndustry");
      expect(pattern).toHaveProperty("customerScale");
      expect(pattern).toHaveProperty("proposalContent");
      expect(pattern).toHaveProperty("successFactor");
      expect(pattern).toHaveProperty("relevanceScore");
      expect(pattern).toHaveProperty("contractDate");
      expect(pattern).toHaveProperty("dealValue");
    });

    // 5. モックが正しく呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});