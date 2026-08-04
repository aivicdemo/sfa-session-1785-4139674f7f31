import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import type { AIRecommendationEngine } from "../../src/types/ai-recommendation-engine";
import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1679: [error] 推奨根拠可視化機能 - 根拠の信頼度スコアが 0 未満のとき、エラーが発生する
  test("should throw ValidationError with ERR_INVALID_CONFIDENCE_SCORE when confidence score is below 0", () => {
    const mockAIEngine: Partial<AIRecommendationEngine> = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        confidence_score: -0.5,
        applicable: false,
      }),
    };

    const new_case_data = {
      customer_id: "CUST_20240115_001",
      customer_name: "Example Corp",
      industry: "IT",
      company_size: "large",
      deal_amount: 5000000,
      deal_stage: "proposal",
      created_at: "2024-01-15T10:00:00Z",
    };

    const deal_conditions = {
      deal_id: "DEAL_20240115_001",
      customer_id: "CUST_20240115_001",
      required_budget_min: 3000000,
      required_budget_max: 8000000,
      target_decision_maker: "CTO",
      decision_timeline_days: 30,
    };

    expect(() => {
      visualizeRecommendationRationale(
        new_case_data,
        deal_conditions,
        mockAIEngine as AIRecommendationEngine
      );
    }).toThrow(/信頼度スコア|ERR_INVALID_CONFIDENCE_SCORE/);
  });
});