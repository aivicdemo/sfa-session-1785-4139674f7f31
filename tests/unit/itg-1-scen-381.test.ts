import { calculateSuccessPatternMatchScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-381: [normal] 成功パターンマッチング・提案アプローチ判定機能 - 判定根拠として成功パターン生成時の商談特性が営業担当者に提示される
  test("should present matched success pattern with deal characteristics as judgment rationale", () => {
    const input_deal_characteristics = {
      industry: "製造業",
      deal_amount_million_yen: 5.0,
      proposal_period_months: 3,
      customer_scale: "中堅企業",
    };

    const success_pattern_template = {
      pattern_id: "pattern_001",
      industry: "製造業",
      deal_amount_min_million_yen: 3.0,
      deal_amount_max_million_yen: 10.0,
      proposal_period_months: 3,
      customer_scale: "中堅企業",
      match_weight_industry: 0.25,
      match_weight_deal_amount: 0.25,
      match_weight_proposal_period: 0.25,
      match_weight_customer_scale: 0.25,
    };

    const result = calculateSuccessPatternMatchScore(
      input_deal_characteristics,
      success_pattern_template
    );

    expect(result).toEqual({
      pattern_id: "pattern_001",
      match_score: 100,
      judgment_rationale: {
        matched_industry: "製造業",
        matched_deal_amount_million_yen: 5.0,
        matched_proposal_period_months: 3,
        matched_customer_scale: "中堅企業",
        industry_match_reason: "入力値「製造業」とパターン定義値「製造業」が完全一致",
        deal_amount_match_reason:
          "入力値5.0百万円がパターン範囲3.0～10.0百万円内に該当",
        proposal_period_match_reason:
          "入力値3ヶ月とパターン定義値3ヶ月が完全一致",
        customer_scale_match_reason:
          "入力値「中堅企業」とパターン定義値「中堅企業」が完全一致",
      },
      original_pattern_characteristics: {
        pattern_industry: "製造業",
        pattern_deal_amount_min_million_yen: 3.0,
        pattern_deal_amount_max_million_yen: 10.0,
        pattern_proposal_period_months: 3,
        pattern_customer_scale: "中堅企業",
      },
    });
  });
});