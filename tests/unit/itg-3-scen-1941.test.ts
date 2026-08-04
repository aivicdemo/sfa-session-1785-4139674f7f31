import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // SCEN-1941
  test("根拠の有効期限がちょうど今日のときに根拠が表示対象となる", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-001",
        recommendedApproach: "提案アプローチA",
        reasoningBasisIds: ["basis-edge-001"],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const reasoningBasisDatabase = [
      {
        basisId: "basis-edge-001",
        content: "顧客業種が製造業の場合、提案アプローチAが成功率78%",
        validUntil: "2026-08-01T23:59:59Z",
      },
    ];

    const newDealData = {
      customerIndustry: "製造業",
      dealAmount: 5000000,
      dealName: "新規案件001",
    };

    const result = displayRecommendationReasoning(
      newDealData,
      mockAIEngine,
      reasoningBasisDatabase
    );

    expect(result.includeReasoning).toBe(true);
    expect(result.reasoningContent).toEqual(
      "顧客業種が製造業の場合、提案アプローチAが成功率78%"
    );
    expect(result.displayReasoning).toBe(true);
  });
});