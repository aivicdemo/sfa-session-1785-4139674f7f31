import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - 適用可能スコア算出", () => {
  // SCEN-567
  test("適用可能スコア算出時に端数が発生するとき小数第2位で四捨五入される", () => {
    // Arrange
    const newDealCondition = {
      customerIndustry: "manufacturing",
      customerSize: "large",
      dealValue: 5000000,
      dealStage: "proposal",
    };

    const successPattern = {
      patternId: "pat-001",
      industry: "manufacturing",
      sizeRange: "large",
      valueRange: "high",
      successRate: 0.85,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((condition, pattern) => {
        return 0.8756;
      }),
    };

    // Act
    const result = evaluatePatternRelevance(
      newDealCondition,
      successPattern,
      mockAIEngine
    );

    // Assert
    expect(result.applicabilityScore).toBe(0.88);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealCondition,
      successPattern
    );
  });

  test("複数の端数パターンについて小数第2位で正確に四捨五入される", () => {
    // Arrange
    const testCases = [
      { rawScore: 0.8744, expected: 0.87 },
      { rawScore: 0.8745, expected: 0.87 },
      { rawScore: 0.8754, expected: 0.88 },
      { rawScore: 0.8755, expected: 0.88 },
    ];

    const newDealCondition = {
      customerIndustry: "retail",
      customerSize: "medium",
      dealValue: 2000000,
      dealStage: "negotiation",
    };

    const successPattern = {
      patternId: "pat-002",
      industry: "retail",
      sizeRange: "medium",
      valueRange: "medium",
      successRate: 0.78,
    };

    // Assert
    testCases.forEach(({ rawScore, expected }) => {
      const mockAIEngine = {
        evaluatePatternRelevance: jest.fn(() => rawScore),
      };

      const result = evaluatePatternRelevance(
        newDealCondition,
        successPattern,
        mockAIEngine
      );

      expect(result.applicabilityScore).toBe(expected);
    });
  });
});