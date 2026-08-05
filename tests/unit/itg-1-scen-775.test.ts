import { classifyDetectedProblems } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-775
  test("問題検出結果の重要度・優先度分類機能 - 検出された問題が複数件の場合、すべての問題が重要度と優先度で分類される", () => {
    const detected_problems = [
      {
        problem_id: "prob_001",
        problem_type: "data_quality_score_below_threshold",
        detected_at: "2024-01-15T10:30:00Z",
        impact_scope: "customer_data_duplicate_detection",
        affected_record_count: 150,
        severity_indicator: 0.92,
      },
      {
        problem_id: "prob_002",
        problem_type: "ai_inference_accuracy_degradation",
        detected_at: "2024-01-15T10:35:00Z",
        impact_scope: "proposal_pattern_matching",
        affected_record_count: 45,
        severity_indicator: 0.78,
      },
      {
        problem_id: "prob_003",
        problem_type: "system_health_degradation",
        detected_at: "2024-01-15T10:40:00Z",
        impact_scope: "sales_activity_log_processing",
        affected_record_count: 8,
        severity_indicator: 0.65,
      },
      {
        problem_id: "prob_004",
        problem_type: "data_quality_score_below_threshold",
        detected_at: "2024-01-15T10:45:00Z",
        impact_scope: "customer_master_synchronization",
        affected_record_count: 32,
        severity_indicator: 0.88,
      },
    ];

    const classification_rules = {
      severity_thresholds: {
        high: 0.85,
        medium: 0.65,
        low: 0.0,
      },
      priority_weights: {
        data_quality_score_below_threshold: 0.4,
        ai_inference_accuracy_degradation: 0.35,
        system_health_degradation: 0.25,
      },
      impact_multipliers: {
        customer_data_duplicate_detection: 1.5,
        proposal_pattern_matching: 1.3,
        sales_activity_log_processing: 1.1,
        customer_master_synchronization: 1.2,
      },
    };

    const result = classifyDetectedProblems(
      detected_problems,
      classification_rules
    );

    expect(result).toEqual({
      total_problems: 4,
      classified_problems: 4,
      unclassified_count: 0,
      classifications: [
        {
          problem_id: "prob_001",
          problem_type: "data_quality_score_below_threshold",
          severity: "high",
          priority_score: 4,
          classification_reason:
            "severity_indicator 0.92 >= threshold 0.85; priority_score calculated from problem_type weight 0.4 * impact_multiplier 1.5 = 0.6, mapped to priority 4",
        },
        {
          problem_id: "prob_002",
          problem_type: "ai_inference_accuracy_degradation",
          severity: "medium",
          priority_score: 3,
          classification_reason:
            "severity_indicator 0.78 in range [0.65, 0.85); priority_score calculated from problem_type weight 0.35 * impact_multiplier 1.3 = 0.455, mapped to priority 3",
        },
        {
          problem_id: "prob_003",
          problem_type: "system_health_degradation",
          severity: "low",
          priority_score: 2,
          classification_reason:
            "severity_indicator 0.65 in range [0.0, 0.65); priority_score calculated from problem_type weight 0.25 * impact_multiplier 1.1 = 0.275, mapped to priority 2",
        },
        {
          problem_id: "prob_004",
          problem_type: "data_quality_score_below_threshold",
          severity: "high",
          priority_score: 4,
          classification_reason:
            "severity_indicator 0.88 >= threshold 0.85; priority_score calculated from problem_type weight 0.4 * impact_multiplier 1.2 = 0.48, mapped to priority 4",
        },
      ],
      summary: {
        high_severity_count: 2,
        medium_severity_count: 1,
        low_severity_count: 1,
        highest_priority_problems: ["prob_001", "prob_004"],
        recommended_action_order: ["prob_001", "prob_004", "prob_002", "prob_003"],
      },
    });

    const all_have_severity = result.classifications.every((c) =>
      ["high", "medium", "low"].includes(c.severity)
    );
    expect(all_have_severity).toBe(true);

    const all_have_priority = result.classifications.every(
      (c) => typeof c.priority_score === "number" && c.priority_score >= 1 && c.priority_score <= 5
    );
    expect(all_have_priority).toBe(true);

    expect(result.unclassified_count).toBe(0);

    result.classifications.forEach((classification) => {
      expect(classification.problem_id).toBeDefined();
      expect(classification.severity).toBeDefined();
      expect(classification.priority_score).toBeDefined();
      expect(classification.classification_reason).toBeDefined();
    });
  });
});