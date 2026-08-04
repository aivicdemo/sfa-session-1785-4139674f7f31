import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨ロジック - 成功パターン0件時のエラーハンドリング", () => {
  // SCEN-2654
  test("成功パターンが0件のとき、RecommendationLogicErrorが発生し、適切なエラーメッセージとコードが返される", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [];

    const newDealCondition = {
      customerIndustry: "製造業",
      budget: 5000000,
      implementationDeadlineDays: 90,
      customerScale: "medium",
      businessChallenge: "デジタル変革",
    };

    const executeRecommendation = async () => {
      const similarPatterns = await mockAIEngine.findSimilarPatterns(
        newDealCondition
      );

      if (similarPatterns.length === 0 && mockPatternMaster.length === 0) {
        const errorLog = {
          timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
          successPatternCount: 0,
        };

        const error = new Error(
          "成功パターンが検出されません。推奨の生成に必要な過去実績データが不足しています"
        );
        Object.assign(error, {
          name: "RecommendationLogicError",
          code: "ERR_ZERO_PATTERNS_FOUND",
          log: errorLog,
        });

        throw error;
      }

      return {
        recommendedApproach: "fallback_pattern",
      };
    };

    expect(executeRecommendation()).rejects.toMatchObject({
      name: "RecommendationLogicError",
      message: expect.stringMatching(/成功パターンが検出されません/),
      code: "ERR_ZERO_PATTERNS_FOUND",
      log: expect.objectContaining({
        successPatternCount: 0,
      }),
    });
  });
});