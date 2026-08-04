import { describe, test, expect } from "@jest/globals";
import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-2387: 推論精度スコア算出機能 - 顧客対応パターン分析結果がnullのとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      analyzeCustomerInteractionPattern: jest.fn().mockReturnValue(null),
    };

    const newDealData = {
      customer_id: "CUST-001",
      customer_name: "Sample Company",
      industry: "IT",
      company_size: "mid",
      deal_id: "DEAL-2024-001",
      deal_stage: "proposal",
      deal_amount: 500000,
      deal_timeline: 90,
    };

    expect(() => {
      calculateInferenceAccuracyScore(newDealData, mockAIRecommendationEngine);
    }).toThrow(/PATTERN_ANALYSIS_NULL/);
  });
});