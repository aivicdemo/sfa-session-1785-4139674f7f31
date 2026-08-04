import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1372
  test("AIRecommendationEngine.generateRecommendation が失敗した場合、内部の推奨パターンマスタから統計上位の成功パターンを表示し、代替根拠を提供する", async () => {
    const dealId = "DEAL-001";
    const customerId = "CUST-2024-001";
    const dealConditions = {
      customerIndustry: "製造業",
      customerSize: "中堅企業",
      dealStage: "初期接触",
      dealAmount: 5000000,
      productCategory: "システム導入",
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest
        .fn()
        .mockRejectedValue(new Error("Network timeout")),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        patternId: "PATTERN-001",
        industry: "製造業",
        companySize: "中堅企業",
        successCount: 45,
        successRate: 0.82,
        recommendedApproach: "段階的導入アプローチ",
        briefExplanation: "類似業種での成功実績が豊富。段階導入で リスク低減。",
      },
      {
        patternId: "PATTERN-002",
        industry: "製造業",
        companySize: "中堅企業",
        successCount: 38,
        successRate: 0.75,
        recommendedApproach: "一括導入アプローチ",
        briefExplanation: "導入期間短縮のための一括導入。",
      },
      {
        patternId: "PATTERN-003",
        industry: "製造業",
        companySize: "中堅企業",
        successCount: 22,
        successRate: 0.68,
        recommendedApproach: "部分導入アプローチ",
        briefExplanation: "機能限定での段階的拡張。",
      },
    ];

    const result = await visualizeRecommendationReasoning(
      dealId,
      customerId,
      dealConditions,
      mockAIRecommendationEngine,
      mockPatternMaster
    );

    expect(result).toHaveProperty("userMessage");
    expect(result.userMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    expect(result).toHaveProperty("fallbackPattern");
    expect(result.fallbackPattern).toEqual({
      patternId: "PATTERN-001",
      industry: "製造業",
      companySize: "中堅企業",
      successCount: 45,
      successRate: 0.82,
      recommendedApproach: "段階的導入アプローチ",
      briefExplanation: "類似業種での成功実績が豊富。段階導入で リスク低減。",
    });

    expect(result).toHaveProperty("reasoningBrief");
    expect(typeof result.reasoningBrief).toBe("string");
    expect(result.reasoningBrief.length).toBeGreaterThan(0);
    expect(result.reasoningBrief.length).toBeLessThan(200);

    expect(result).toHaveProperty("isUsingFallback");
    expect(result.isUsingFallback).toBe(true);

    expect(result).toHaveProperty("retryAttempts");
    expect(result.retryAttempts).toBe(3);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    const calls = mockAIRecommendationEngine.generateRecommendation.mock.calls;
    expect(calls[0][0]).toEqual(dealConditions);
    expect(calls[1][0]).toEqual(dealConditions);
    expect(calls[2][0]).toEqual(dealConditions);

    expect(result).not.toHaveProperty("aiGeneratedReasoning");
    expect(result.reasoningBrief).toContain("成功");
  });
});