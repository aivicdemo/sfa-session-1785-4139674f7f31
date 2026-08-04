import { evaluateRecommendationRelevance } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2867: 営業現場文脈適合スコアが100を超えるときエラーを返す", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const valid_recommendation_input = {
      customer_id: "CUST-001",
      deal_stage: "proposal",
      budget_amount: 500000,
      customer_industry: "manufacturing",
      customer_size: "enterprise",
    };

    const call_function = () => {
      evaluateRecommendationRelevance(valid_recommendation_input, mockAIEngine);
    };

    expect(call_function).toThrow(/営業現場文脈適合スコア/);
  });
});