import { analyzeBusinessProcessExecution } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-784
  test("行動パターンデータが欠落している場合、分析結果に null が含まれない", () => {
    const business_deal_with_missing_behavior = {
      deal_id: "DEAL-001",
      customer_id: "CUST-001",
      sales_person_id: "SALES-001",
      deal_stage: "negotiation",
      created_date: "2024-01-15T10:00:00Z",
      last_contact_date: "2024-01-20T14:30:00Z",
      estimated_amount: 500000,
      behavior_patterns: [],
      contact_frequency: 0,
      proposal_count: 0,
      follow_up_count: 0,
    };

    const analysis_result = analyzeBusinessProcessExecution(
      business_deal_with_missing_behavior
    );

    expect(analysis_result).toBeDefined();
    expect(analysis_result).not.toBeNull();

    const result_keys = Object.keys(analysis_result);
    result_keys.forEach((key) => {
      const value = analysis_result[key as keyof typeof analysis_result];

      if (Array.isArray(value)) {
        expect(value).not.toContain(null);
        expect(value).not.toContain(undefined);
        value.forEach((item) => {
          expect(item).not.toBeNull();
          expect(item).not.toBeUndefined();
        });
      } else {
        expect(value).not.toBeNull();
        expect(value).not.toBeUndefined();
      }
    });

    expect(analysis_result.process_compliance_score).toEqual(0);
    expect(analysis_result.deviation_patterns).toEqual([]);
    expect(analysis_result.recommended_actions).toEqual([]);
    expect(analysis_result.has_behavior_data).toBe(false);
  });
});