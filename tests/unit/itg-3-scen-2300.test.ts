import {
  compareProposalAndCustomerResponsePatterns,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化 - 複数顧客対応記録の標準プロセス比較", () => {
  test("SCEN-2300: 顧客対応記録が複数件のとき全件が標準プロセスと比較される", () => {
    const customer_id = "CUST-2024-001";
    const sales_process_id = "PROC-STD-001";

    const customer_response_records = [
      {
        record_id: "REC-001",
        customer_id: customer_id,
        stage: "initial_contact",
        interaction_date: "2024-01-15T10:00:00Z",
        action_description: "初回接触、顧客のニーズヒアリング実施",
        outcome: "ニーズ確認完了",
      },
      {
        record_id: "REC-002",
        customer_id: customer_id,
        stage: "proposal_followup",
        interaction_date: "2024-01-22T14:30:00Z",
        action_description: "提案資料のフォローアップメール送付、質問対応",
        outcome: "顧客から前向きな反応",
      },
      {
        record_id: "REC-003",
        customer_id: customer_id,
        stage: "closing",
        interaction_date: "2024-02-05T11:00:00Z",
        action_description: "最終条件調整、契約署名予定日確認",
        outcome: "契約予定日決定",
      },
    ];

    const new_proposal = {
      proposal_id: "PROP-2024-100",
      customer_id: customer_id,
      product_category: "enterprise_solution",
      proposed_value: 5000000,
      proposed_timeline: "2024-03-15T00:00:00Z",
    };

    const mock_standard_patterns = [
      {
        pattern_id: "PAT-001",
        stage: "initial_contact",
        success_criteria: "ニーズ確認と予算枠の把握",
      },
      {
        pattern_id: "PAT-002",
        stage: "proposal_followup",
        success_criteria: "提案資料確認完了、質問解消",
      },
      {
        pattern_id: "PAT-003",
        stage: "closing",
        success_criteria: "契約条件合意、署名日確定",
      },
      {
        pattern_id: "PAT-004",
        stage: "initial_contact",
        success_criteria: "複数部門の関係者確認",
      },
      {
        pattern_id: "PAT-005",
        stage: "proposal_followup",
        success_criteria: "経営層レビュー実施",
      },
    ];

    const mock_relevance_scores = {
      "REC-001": 0.92,
      "REC-002": 0.88,
      "REC-003": 0.85,
    };

    const mock_engine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mock_standard_patterns),
      evaluatePatternRelevance: jest.fn((record_id: string) => {
        return mock_relevance_scores[record_id as keyof typeof mock_relevance_scores] || 0;
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = compareProposalAndCustomerResponsePatterns(
      customer_response_records,
      new_proposal,
      sales_process_id,
      mock_engine
    );

    expect(mock_engine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenNthCalledWith(1, "REC-001");
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenNthCalledWith(2, "REC-002");
    expect(mock_engine.evaluatePatternRelevance).toHaveBeenNthCalledWith(3, "REC-003");

    expect(result).toHaveProperty("comparison_results");
    expect(Array.isArray(result.comparison_results)).toBe(true);
    expect(result.comparison_results).toHaveLength(3);

    const rec_001_result = result.comparison_results[0];
    expect(rec_001_result).toHaveProperty("record_id");
    expect(rec_001_result.record_id).toBe("REC-001");
    expect(rec_001_result).toHaveProperty("match_score");
    expect(typeof rec_001_result.match_score).toBe("number");
    expect(rec_001_result.match_score).toBe(0.92);
    expect(rec_001_result).toHaveProperty("deviation_points");
    expect(Array.isArray(rec_001_result.deviation_points)).toBe(true);
    expect(rec_001_result).toHaveProperty("recommendation");
    expect(typeof rec_001_result.recommendation).toBe("string");

    const rec_002_result = result.comparison_results[1];
    expect(rec_002_result.record_id).toBe("REC-002");
    expect(rec_002_result.match_score).toBe(0.88);
    expect(rec_002_result).toHaveProperty("deviation_points");
    expect(rec_002_result).toHaveProperty("recommendation");

    const rec_003_result = result.comparison_results[2];
    expect(rec_003_result.record_id).toBe("REC-003");
    expect(rec_003_result.match_score).toBe(0.85);
    expect(rec_003_result).toHaveProperty("deviation_points");
    expect(rec_003_result).toHaveProperty("recommendation");

    result.comparison_results.forEach((item) => {
      expect(item.record_id).toBeTruthy();
      expect(typeof item.match_score).toBe("number");
      expect(item.match_score).toBeGreaterThanOrEqual(0);
      expect(item.match_score).toBeLessThanOrEqual(1);
      expect(item.deviation_points).not.toBeNull();
      expect(item.recommendation).not.toBeNull();
      expect(item.recommendation).not.toBe("");
    });
  });
});