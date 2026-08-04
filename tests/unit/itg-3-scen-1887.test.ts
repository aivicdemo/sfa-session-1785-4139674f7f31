import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1887
  test("AIRecommendationEngine の generateRecommendation がタイムアウトしたとき内部パターンマスタから統計的推奨を返す", async () => {
    const newCaseInput = {
      industry: "IT",
      budget: 5000000,
      decisionTimeline: 3,
      customerSize: "mid",
      currentChallenge: "system_modernization",
    };

    const mockAIEngine = {
      generateRecommendation: jest
        .fn()
        .mockImplementation(
          () =>
            new Promise((_, reject) => {
              setTimeout(() => {
                reject(new Error("Request timeout"));
              }, 31000);
            })
        ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = await generateRecommendation(
      newCaseInput,
      mockAIEngine,
      mockFileStorage
    );

    expect(result).toBeDefined();
    expect(result.recommendedApproach).toBe("executive_presentation");
    expect(result.patternSource).toBe("internal_pattern_master");
    expect(result.confidenceScore).toBe(78);
    expect(result.reasoningExplanation).toMatch(/過去の推奨履歴から類似案件/);
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(typeof result.confidenceScore).toBe("number");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);
  });
});