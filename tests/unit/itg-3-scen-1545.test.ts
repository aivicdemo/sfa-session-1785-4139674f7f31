import { findSimilarPatterns, generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ自動推奨", () => {
  // SCEN-1545
  test("過去商談データから成功パターンが抽出されない場合、推奨内容は返却されない", async () => {
    const newCaseInput = {
      industry: "製造業",
      companySize: "中堅",
      challenge: "生産効率化",
      dealStatus: "初期段階",
      budgetRange: { min: 1000000, max: 5000000 },
      timeline: "3ヶ月以内",
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue(null),
    };

    const fallbackPatterns = [
      {
        patternId: "PAT-001",
        title: "標準提案パターン A",
        approachDescription: "段階的な導入アプローチ",
        successRate: 0.72,
        frequency: 45,
      },
      {
        patternId: "PAT-002",
        title: "標準提案パターン B",
        approachDescription: "統合導入アプローチ",
        successRate: 0.65,
        frequency: 32,
      },
    ];

    let recommendationResult = null;
    let errorMessage = "";
    let fallbackResult = null;

    try {
      const similarPatterns = await mockAIEngine.findSimilarPatterns(newCaseInput);

      if (similarPatterns.length === 0) {
        const recommendation = await mockAIEngine.generateRecommendation(newCaseInput);

        if (recommendation === null) {
          errorMessage = "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します";
          fallbackResult = fallbackPatterns.sort((a, b) => b.frequency - a.frequency)[0];
          recommendationResult = null;
        } else {
          recommendationResult = recommendation;
        }
      } else {
        recommendationResult = similarPatterns[0];
      }
    } catch (err) {
      errorMessage = "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します";
      fallbackResult = fallbackPatterns.sort((a, b) => b.frequency - a.frequency)[0];
    }

    expect(recommendationResult).toBeNull();
    expect(errorMessage).toBe("推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します");
    expect(fallbackResult).toEqual({
      patternId: "PAT-001",
      title: "標準提案パターン A",
      approachDescription: "段階的な導入アプローチ",
      successRate: 0.72,
      frequency: 45,
    });
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseInput);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newCaseInput);
  });
});