import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  judgeDetectionResultImportance,
  determineExecutiveReportingTarget,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-813
  test("検出結果複数件のとき、各件について重要度が判定され営業部長報告対象が決定される", () => {
    const detection_result_1 = {
      detection_result_id: "det_001",
      sales_staff_id: "staff_001",
      detected_pattern_type: "process_deviation",
      deviation_severity_score: 8.5,
      customer_impact_count: 5,
      process_adherence_rate: 0.65,
      recommendation_confidence_score: 0.92,
      root_cause_description: "初回接触から提案までの時間が標準より30日遅延",
    };

    const detection_result_2 = {
      detection_result_id: "det_002",
      sales_staff_id: "staff_002",
      detected_pattern_type: "proposal_quality_mismatch",
      deviation_severity_score: 4.2,
      customer_impact_count: 1,
      process_adherence_rate: 0.88,
      recommendation_confidence_score: 0.75,
      root_cause_description: "提案内容が顧客ニーズと部分的に不適合",
    };

    const detection_result_3 = {
      detection_result_id: "det_003",
      sales_staff_id: "staff_003",
      detected_pattern_type: "followup_frequency_insufficient",
      deviation_severity_score: 2.1,
      customer_impact_count: 0,
      process_adherence_rate: 0.92,
      recommendation_confidence_score: 0.68,
      root_cause_description: "フォローアップ頻度が基準値より低い",
    };

    const detectionResults = [
      detection_result_1,
      detection_result_2,
      detection_result_3,
    ];

    const importanceJudgments = detectionResults.map((result) =>
      judgeDetectionResultImportance({
        detection_result_id: result.detection_result_id,
        deviation_severity_score: result.deviation_severity_score,
        customer_impact_count: result.customer_impact_count,
        process_adherence_rate: result.process_adherence_rate,
        recommendation_confidence_score: result.recommendation_confidence_score,
      })
    );

    expect(importanceJudgments).toHaveLength(3);

    expect(importanceJudgments[0]).toEqual({
      detection_result_id: "det_001",
      importance_level: "high",
      importance_score: 8.5,
      impact_assessment: {
        severity: "critical",
        affected_customer_count: 5,
      },
      reasoning: expect.stringContaining("重大度"),
    });

    expect(importanceJudgments[1]).toEqual({
      detection_result_id: "det_002",
      importance_level: "medium",
      importance_score: 4.2,
      impact_assessment: {
        severity: "moderate",
        affected_customer_count: 1,
      },
      reasoning: expect.stringContaining("中程度"),
    });

    expect(importanceJudgments[2]).toEqual({
      detection_result_id: "det_003",
      importance_level: "low",
      importance_score: 2.1,
      impact_assessment: {
        severity: "minor",
        affected_customer_count: 0,
      },
      reasoning: expect.stringContaining("軽微"),
    });

    const executiveReportingTargets = importanceJudgments.map(
      (judgment, index) =>
        determineExecutiveReportingTarget({
          detection_result_id: judgment.detection_result_id,
          importance_level: judgment.importance_level,
          importance_score: judgment.importance_score,
          affected_customer_count:
            judgment.impact_assessment.affected_customer_count,
          sales_staff_id: detectionResults[index].sales_staff_id,
          root_cause_description:
            detectionResults[index].root_cause_description,
        })
    );

    expect(executiveReportingTargets).toHaveLength(3);

    expect(executiveReportingTargets[0]).toEqual({
      detection_result_id: "det_001",
      should_report_to_executive: true,
      reporting_priority: "urgent",
      executive_summary: expect.stringContaining("重大"),
      action_required_flag: true,
      estimated_resolution_days: expect.any(Number),
    });

    expect(executiveReportingTargets[1]).toEqual({
      detection_result_id: "det_002",
      should_report_to_executive: false,
      reporting_priority: "normal",
      executive_summary: expect.stringContaining("対応"),
      action_required_flag: false,
      estimated_resolution_days: expect.any(Number),
    });

    expect(executiveReportingTargets[2]).toEqual({
      detection_result_id: "det_003",
      should_report_to_executive: false,
      reporting_priority: "low",
      executive_summary: expect.stringContaining("軽微"),
      action_required_flag: false,
      estimated_resolution_days: expect.any(Number),
    });

    expect(executiveReportingTargets[0].should_report_to_executive).toBe(true);
    expect(executiveReportingTargets[1].should_report_to_executive).toBe(false);
    expect(executiveReportingTargets[2].should_report_to_executive).toBe(false);

    const highImportanceResults = importanceJudgments.filter(
      (j) => j.importance_level === "high"
    );
    const highImportanceReportTargets = executiveReportingTargets.filter(
      (t) =>
        t.detection_result_id ===
        highImportanceResults[0]?.detection_result_id
    );
    expect(highImportanceReportTargets[0].should_report_to_executive).toBe(
      true
    );

    const mediumImportanceResults = importanceJudgments.filter(
      (j) => j.importance_level === "medium"
    );
    const mediumImportanceReportTargets = executiveReportingTargets.filter(
      (t) =>
        t.detection_result_id ===
        mediumImportanceResults[0]?.detection_result_id
    );
    expect(mediumImportanceReportTargets[0].should_report_to_executive).toBe(
      false
    );

    const lowImportanceResults = importanceJudgments.filter(
      (j) => j.importance_level === "low"
    );
    const lowImportanceReportTargets = executiveReportingTargets.filter(
      (t) =>
        t.detection_result_id === lowImportanceResults[0]?.detection_result_id
    );
    expect(lowImportanceReportTargets[0].should_report_to_executive).toBe(
      false
    );

    for (let i = 0; i < detectionResults.length; i++) {
      for (let j = i + 1; j < detectionResults.length; j++) {
        expect(importanceJudgments[i].detection_result_id).not.toBe(
          importanceJudgments[j].detection_result_id
        );
        expect(importanceJudgments[i].importance_level).toBeDefined();
        expect(importanceJudgments[j].importance_level).toBeDefined();
        expect(
          [
            importanceJudgments[i].importance_level,
            importanceJudgments[j].importance_level,
          ].every((level) => ["high", "medium", "low"].includes(level))
        ).toBe(true);
      }
    }
  });
});