import { extractAndStructureSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  // SCEN-2529
  test("成功要因と失敗要因に重複データを含むとき、重複が排除される", () => {
    const successFactors = [
      "顧客規模_大企業",
      "業界_IT",
      "予算_1000万以上",
      "意思決定者_CTO",
    ];
    const failureFactors = [
      "顧客規模_大企業",
      "競合他社_存在",
      "予算_1000万以上",
      "導入時期_急ぎ",
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractAndStructureSuccessPatterns(
      successFactors,
      failureFactors,
      mockAIRecommendationEngine
    );

    const expectedStructuredSuccessFactors = [
      "業界_IT",
      "意思決定者_CTO",
    ];
    const expectedStructuredFailureFactors = [
      "競合他社_存在",
      "導入時期_急ぎ",
    ];

    expect(result.structuredSuccessFactors).toEqual(
      expectedStructuredSuccessFactors
    );
    expect(result.structuredFailureFactors).toEqual(
      expectedStructuredFailureFactors
    );

    expect(result.structuredSuccessFactors).not.toContain("顧客規模_大企業");
    expect(result.structuredSuccessFactors).not.toContain("予算_1000万以上");
    expect(result.structuredFailureFactors).not.toContain("顧客規模_大企業");
    expect(result.structuredFailureFactors).not.toContain("予算_1000万以上");

    expect(result.duplicatesRemoved).toEqual([
      "顧客規模_大企業",
      "予算_1000万以上",
    ]);
  });
});