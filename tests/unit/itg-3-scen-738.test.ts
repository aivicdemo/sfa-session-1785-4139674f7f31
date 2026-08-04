import { describe, test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件に推奨アプローチを自動推奨する機能", () => {
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("SCEN-738: findSimilarPatternsが過去成功事例を0件検出したとき、代替動作で推奨パターンマスタから統計的に上位の成功パターンを返却する", async () => {
    const dealConditions = {
      customerId: "CUST-001",
      industry: "IT",
      dealAmount: 5000000,
      productCategory: "クラウドソリューション",
      contactHistory: [],
    };

    const recommendationPatternMaster = [
      {
        patternId: "PATTERN-001",
        industry: "IT",
        productCategory: "クラウドソリューション",
        approach: "段階的な導入プロセスと成功事例の提示",
        successRate: 0.82,
        usageCount: 156,
      },
      {
        patternId: "PATTERN-002",
        industry: "IT",
        productCategory: "クラウドソリューション",
        approach: "ROI試算と3年間のコスト削減効果を強調",
        successRate: 0.78,
        usageCount: 142,
      },
    ];

    const result = await generateRecommendation(
      dealConditions,
      mockAIRecommendationEngine,
      recommendationPatternMaster
    );

    expect(result.recommendation).toBeNull();
    expect(result.errorCode).toBe("NO_SIMILAR_PATTERNS_FOUND");
    expect(result.errorMessage).toBe(
      "過去の成功事例が見つかりません。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.fallbackMode).toBe(true);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(result.recommendationFallback).toHaveLength(2);
    expect(result.recommendationFallback[0].patternId).toBe("PATTERN-001");
    expect(result.recommendationFallback[0].successRate).toBe(0.82);
    expect(result.recommendationFallback[0].usageCount).toBe(156);
    expect(result.recommendationFallback[1].patternId).toBe("PATTERN-002");
    expect(result.recommendationFallback[1].successRate).toBe(0.78);
  });
});