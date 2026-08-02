import { judgeNormalizationRuleValidity } from "../../src/logic/it-1-br-2-2-1-1";

describe("修正ルール承認判定機能", () => {
  // SCEN-582
  test("正規化ルールの妥当性が確認される", () => {
    const past_approved_rules = [
      {
        rule_id: "RULE_PHONE_001",
        rule_type: "phone_number",
        rule_content: "ハイフンなし11桁形式に統一",
        approval_date: "2024-01-10",
        applicability_score: 0.92,
        past_effect: { error_reduction_rate: 0.87, data_quality_improvement: 0.89 },
      },
      {
        rule_id: "RULE_PHONE_002",
        rule_type: "phone_number",
        rule_content: "国番号付き形式への統一",
        approval_date: "2024-02-05",
        applicability_score: 0.85,
        past_effect: { error_reduction_rate: 0.81, data_quality_improvement: 0.84 },
      },
      {
        rule_id: "RULE_PHONE_003",
        rule_type: "phone_number",
        rule_content: "内線番号の正規化",
        approval_date: "2024-03-20",
        applicability_score: 0.88,
        past_effect: { error_reduction_rate: 0.79, data_quality_improvement: 0.82 },
      },
      {
        rule_id: "RULE_COMPANY_001",
        rule_type: "company_name",
        rule_content: "株式会社の表記統一",
        approval_date: "2024-01-15",
        applicability_score: 0.95,
        past_effect: { error_reduction_rate: 0.93, data_quality_improvement: 0.94 },
      },
      {
        rule_id: "RULE_ADDRESS_001",
        rule_type: "address",
        rule_content: "都道府県コード化",
        approval_date: "2024-02-10",
        applicability_score: 0.91,
        past_effect: { error_reduction_rate: 0.88, data_quality_improvement: 0.90 },
      },
    ];

    const current_quality_standard = {
      normalization_rules: [
        {
          rule_type: "phone_number",
          required: true,
          validation_pattern: "^[0-9]{11}$",
          business_impact: "high",
        },
        {
          rule_type: "company_name",
          required: true,
          validation_pattern: "^[ぁ-ん一-龥ー ]*$",
          business_impact: "high",
        },
        {
          rule_type: "address",
          required: true,
          validation_pattern: "^[0-9]{2}-.*$",
          business_impact: "medium",
        },
      ],
    };

    const new_rule_proposal = {
      rule_id: "RULE_PHONE_004",
      rule_type: "phone_number",
      rule_content: "ハイフンなし11桁形式に統一",
      target_data_field: "customer_phone",
      estimated_impact_records: 1250,
    };

    const result = judgeNormalizationRuleValidity(
      new_rule_proposal,
      past_approved_rules,
      current_quality_standard
    );

    expect(result).toEqual({
      recommendation: "承認推奨",
      confidence_score: 0.95,
      similarity_basis:
        "過去3件の電話番号統一ルール承認事例との合致度95%",
      referenced_past_rule_ids: ["RULE_PHONE_001", "RULE_PHONE_002", "RULE_PHONE_003"],
      risk_items: [],
      conformance_details: {
        matches_quality_standard: true,
        business_impact_alignment: "high",
        applicability_average: 0.88,
        effectiveness_average: {
          error_reduction_rate: 0.82,
          data_quality_improvement: 0.85,
        },
      },
      additional_notes: "標準承認事例に基づいた判定です",
    });
  });
});