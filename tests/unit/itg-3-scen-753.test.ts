import { describe, test, expect, beforeEach } from "@jest/globals";
import { judgeRecommendationEligibility } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推奨生成可能性判定 - 過去成功パターンマスタ最小件数", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-753
  test("成功パターンマスタが1件のとき、推奨生成可能と判定される", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const mockSimilarPattern = {
      patternId: "pattern_001",
      customerIndustry: "製造業",
      companyScale: "中堅企業",
      issueCategory: "生産効率化",
      successRate: 0.85,
      proposalApproach: "自動化提案",
      approachDetail: "生産ラインの自動化により月間工数を30%削減",
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue([
      mockSimilarPattern,
    ]);

    const customerData = {
      industry: "製造業",
      companyScale: "中堅企業",
      businessChallenge: "生産効率化が急務",
      annualRevenue: 5000000000,
      employeeCount: 250,
    };

    const result = judgeRecommendationEligibility(
      customerData,
      mockAIRecommendationEngine
    );

    expect(result.isEligible).toBe(true);
    expect(result.status).toBe("ELIGIBLE");
    expect(result.minimumPatternsRequirement).toBe(1);
    expect(result.detectedPatternCount).toBe(1);
    expect(result.canProceedToGeneration).toBe(true);
  });
});