import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 成功パターン適用可能性スコア化", () => {
  test("SCEN-930: 抽出した成功パターンが新規案件に適用可能かスコア化されるとき、スコアが0以上1以下の範囲で正規化される", () => {
    const pastSuccessPattern = {
      customerSize: 100,
      budget: 10000000,
      decisionPeriodDays: 60,
    };

    const newDealCondition = {
      customerSize: 150,
      budget: 15000000,
      decisionPeriodDays: 45,
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const testCases = [
      { input: 0.0, expected: 0.0 },
      { input: 0.5, expected: 0.5 },
      { input: 1.0, expected: 1.0 },
      { input: -0.1, expected: 0.0 },
      { input: 1.5, expected: 1.0 },
    ];

    testCases.forEach((testCase) => {
      mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValueOnce({
        relevanceScore: testCase.input,
      });

      const result = evaluatePatternRelevance(
        pastSuccessPattern,
        newDealCondition,
        mockAIRecommendationEngine
      );

      expect(result).toBe(testCase.expected);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});