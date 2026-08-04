import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェントの推奨根拠の可視化機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1844
  test("推奨内容が null のとき根拠情報取得に失敗し、代替動作として内部パターンマスタから統計的に上位の成功パターンと簡略版根拠説明が表示される", async () => {
    const { visualizeRecommendationReasoning } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    const mockCustomerData = {
      customer_id: "CUST_001",
      industry: "IT",
      company_size: "large",
      current_challenges: ["digital_transformation"],
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(null),
      explainRecommendationReasoning: jest
        .fn()
        .mockRejectedValue(new TypeError("Cannot read property of null")),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFallbackPatternMaster = {
      getTopPatternsByRank: jest.fn().mockReturnValue([
        {
          pattern_id: "PAT_TOP_001",
          pattern_name: "Digital Transformation via Cloud Migration",
          success_rate: 0.87,
          rank: 1,
          brief_reasoning: "Cloud 導入により運用効率が平均 35% 向上",
        },
        {
          pattern_id: "PAT_TOP_002",
          pattern_name: "Process Automation Implementation",
          success_rate: 0.81,
          rank: 2,
          brief_reasoning: "プロセス自動化で人件費削減 28% 実現",
        },
      ]),
    };

    const result = await visualizeRecommendationReasoning(
      mockCustomerData,
      mockAIRecommendationEngine,
      mockFallbackPatternMaster
    );

    expect(result).toEqual({
      status: "error_fallback_activated",
      error_message: "推奨の生成に失敗しました。過去の推奨履歴から類似案件を表示します",
      fallback_patterns: [
        {
          pattern_id: "PAT_TOP_001",
          pattern_name: "Digital Transformation via Cloud Migration",
          success_rate: 0.87,
          rank: 1,
          brief_reasoning: "Cloud 導入により運用効率が平均 35% 向上",
        },
        {
          pattern_id: "PAT_TOP_002",
          pattern_name: "Process Automation Implementation",
          success_rate: 0.81,
          rank: 2,
          brief_reasoning: "プロセス自動化で人件費削減 28% 実現",
        },
      ],
      recommendation_details: null,
      confidence_score: null,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      mockCustomerData
    );
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalled();
    expect(mockFallbackPatternMaster.getTopPatternsByRank).toHaveBeenCalled();
  });
});