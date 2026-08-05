import { evaluateProblemDetectionResultsForRelevance } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-818: [normal] 問題検出結果の重要度・根拠・対応必要性判定機能 - 対応必要性が低い問題の根拠情報が正確に抽出される
  test("should accurately extract rationale information for low-priority problems", () => {
    // 準備: 対応必要性が『低』と判定される問題データを構築
    const problem_detection_input = {
      problem_id: "PROB-2024-001",
      problem_type: "process_deviation",
      severity_level: "minor",
      impact_on_revenue: false,
      process_rule_id: "PR-FOLLOWUP-003",
      detected_data_source: "sales_daily_report",
      deviation_description: "フォローアップ頻度が標準プロセスより1日遅延",
      sales_staff_id: "STAFF-100",
      customer_id: "CUST-500",
      detection_timestamp: "2024-01-20T09:15:00Z",
      confidence_score: 0.85,
    };

    // 実行: 根拠情報抽出処理を実行
    const rationale_result = evaluateProblemDetectionResultsForRelevance(
      problem_detection_input
    );

    // 検証: 抽出された根拠情報のフィールドと値が期待値と一致
    expect(rationale_result.relevance_level).toBe("low");
    expect(rationale_result.judgment_reason).toBe(
      "売上への直接的な影響が限定的であり、プロセス改善の優先度が低い"
    );
    expect(rationale_result.related_process_rule_id).toBe("PR-FOLLOWUP-003");
    expect(rationale_result.detected_data_source).toBe("sales_daily_report");
    expect(rationale_result.judgment_score).toBeGreaterThanOrEqual(0.1);
    expect(rationale_result.judgment_score).toBeLessThanOrEqual(0.3);
    expect(rationale_result.problem_id).toBe("PROB-2024-001");
    expect(rationale_result.problem_type).toBe("process_deviation");
    expect(rationale_result.severity_level).toBe("minor");
    expect(rationale_result.impact_on_revenue).toBe(false);
    expect(rationale_result.sales_staff_id).toBe("STAFF-100");
    expect(rationale_result.customer_id).toBe("CUST-500");
  });
});