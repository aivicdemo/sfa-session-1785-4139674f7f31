import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案妥当性確認判定機能 - 推奨根拠の可視化", () => {
  // SCEN-1238
  test("成功パターンマッチスコアが負数のとき、エラーを返す", () => {
    const deal_condition = {
      customer_id: "CUST001",
      customer_industry: "製造業",
      customer_scale: "中堅企業",
      deal_stage: "提案段階",
      proposal_amount: 5000000,
      budget_limit: 10000000,
      decision_timeline_days: 30,
    };

    const invalid_pattern_score = -0.5;

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(invalid_pattern_score),
    };

    expect(() =>
      evaluateProposalValidity(deal_condition, mock_ai_engine)
    ).toThrow(/マッチスコア/);
  });
});