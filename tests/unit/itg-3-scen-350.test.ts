import { verifyRecommendationAccuracyBatch } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-350
  test("[normal] 推奨精度検証機能 - 複数の顧客についての推奨精度を一括検証する場合、顧客ごとの精度が正確に分離される", async () => {
    const customer_a_id = "CUST_A_001";
    const customer_b_id = "CUST_B_002";
    const customer_c_id = "CUST_C_003";

    const deal_a_id = "DEAL_A_101";
    const deal_b_id = "DEAL_B_102";
    const deal_c_id = "DEAL_C_103";

    const verification_timestamp_a = "2024-08-01T09:30:00Z";
    const verification_timestamp_b = "2024-08-01T09:30:00Z";
    const verification_timestamp_c = "2024-08-01T09:30:00Z";

    const accuracy_score_a = 0.92;
    const accuracy_score_b = 0.87;
    const accuracy_score_c = 0.78;

    const pattern_count_a = 5;
    const pattern_count_b = 4;
    const pattern_count_c = 3;

    const batch_request = [
      {
        customer_id: customer_a_id,
        deal_id: deal_a_id,
        customer_attributes: {
          industry: "manufacturing",
          company_size: "large",
          annual_revenue: 50000000,
        },
        deal_conditions: {
          deal_stage: "proposal_submitted",
          product_category: "enterprise_software",
          deal_value: 500000,
        },
      },
      {
        customer_id: customer_b_id,
        deal_id: deal_b_id,
        customer_attributes: {
          industry: "retail",
          company_size: "medium",
          annual_revenue: 20000000,
        },
        deal_conditions: {
          deal_stage: "negotiation",
          product_category: "cloud_service",
          deal_value: 150000,
        },
      },
      {
        customer_id: customer_c_id,
        deal_id: deal_c_id,
        customer_attributes: {
          industry: "healthcare",
          company_size: "small",
          annual_revenue: 5000000,
        },
        deal_conditions: {
          deal_stage: "qualification",
          product_category: "saas_solution",
          deal_value: 50000,
        },
      },
    ];

    const mock_ai_engine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation(async (customer_attrs, deal_conds) => {
          if (
            customer_attrs.industry === "manufacturing" &&
            customer_attrs.company_size === "large"
          ) {
            return {
              relevance_score: accuracy_score_a,
              matching_pattern_count: pattern_count_a,
            };
          } else if (
            customer_attrs.industry === "retail" &&
            customer_attrs.company_size === "medium"
          ) {
            return {
              relevance_score: accuracy_score_b,
              matching_pattern_count: pattern_count_b,
            };
          } else if (
            customer_attrs.industry === "healthcare" &&
            customer_attrs.company_size === "small"
          ) {
            return {
              relevance_score: accuracy_score_c,
              matching_pattern_count: pattern_count_c,
            };
          }
          return {
            relevance_score: 0,
            matching_pattern_count: 0,
          };
        }),
    };

    const result = await verifyRecommendationAccuracyBatch(
      batch_request,
      mock_ai_engine
    );

    expect(result).toHaveLength(3);

    const result_a = result.find((r) => r.customer_id === customer_a_id);
    expect(result_a).toBeDefined();
    expect(result_a?.customer_id).toBe(customer_a_id);
    expect(result_a?.deal_id).toBe(deal_a_id);
    expect(result_a?.accuracy_score).toBe(accuracy_score_a);
    expect(result_a?.related_pattern_count).toBe(pattern_count_a);
    expect(result_a?.verification_timestamp).toBe(verification_timestamp_a);

    const result_b = result.find((r) => r.customer_id === customer_b_id);
    expect(result_b).toBeDefined();
    expect(result_b?.customer_id).toBe(customer_b_id);
    expect(result_b?.deal_id).toBe(deal_b_id);
    expect(result_b?.accuracy_score).toBe(accuracy_score_b);
    expect(result_b?.related_pattern_count).toBe(pattern_count_b);
    expect(result_b?.verification_timestamp).toBe(verification_timestamp_b);

    const result_c = result.find((r) => r.customer_id === customer_c_id);
    expect(result_c).toBeDefined();
    expect(result_c?.customer_id).toBe(customer_c_id);
    expect(result_c?.deal_id).toBe(deal_c_id);
    expect(result_c?.accuracy_score).toBe(accuracy_score_c);
    expect(result_c?.related_pattern_count).toBe(pattern_count_c);
    expect(result_c?.verification_timestamp).toBe(verification_timestamp_c);

    expect(result_a?.accuracy_score).not.toBe(result_b?.accuracy_score);
    expect(result_b?.accuracy_score).not.toBe(result_c?.accuracy_score);
    expect(result_a?.related_pattern_count).not.toBe(
      result_b?.related_pattern_count
    );
    expect(result_b?.related_pattern_count).not.toBe(
      result_c?.related_pattern_count
    );

    expect(mock_ai_engine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
  });
});