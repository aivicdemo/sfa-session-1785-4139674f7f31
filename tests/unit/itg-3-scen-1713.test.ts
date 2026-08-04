import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  // SCEN-1713
  test("成功パターンマッチ度が100.1%のとき推奨スコアを100に正規化する", () => {
    const mock_AIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.1),
    };

    const deal_condition = {
      customer_industry: "製造業",
      customer_scale: "中堅企業",
      customer_budget: 5000000,
      customer_issue: "生産効率化",
      proposal_content: "自動化システム導入",
    };

    const result = evaluatePatternRelevance(
      deal_condition,
      mock_AIRecommendationEngine
    );

    expect(result).toBe(100);
  });
});