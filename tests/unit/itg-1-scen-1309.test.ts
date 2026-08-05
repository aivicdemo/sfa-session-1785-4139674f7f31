import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { Tx12Imp1AiClient } from "../../src/agents/tx-12-imp-1/ai-client";
import { runTx12Imp1Agent } from "../../src/agents/tx-12-imp-1/orchestrator";

// Mock AI Client Implementation
const createMockTx12Imp1AiClient = (): Tx12Imp1AiClient => {
  return {
    confirmMonthlyMeetingTrigger: jest.fn().mockResolvedValue({
      trigger_status: "CONFIRMED",
      confirmed_at: "2024-01-15T11:00:00Z",
    }),
    extractAndValidateMonthlyData: jest.fn().mockResolvedValue({
      data_quality_score: 96.5,
      missing_value_count: 2,
      format_error_count: 1,
      duplicate_detection_count: 3,
      total_records: 500,
      validation_status: "PASSED",
    }),
    analyzeEmployeeBehaviorPatterns: jest.fn().mockResolvedValue({
      employee_id: "EMP001",
      contact_frequency_avg: 4.2,
      proposal_content_diversity_score: 78,
      followup_interval_days_avg: 5.3,
      behavior_analysis_timestamp: "2024-01-15T12:00:00Z",
    }),
    analyzeProcessDeviation: jest.fn().mockResolvedValue({
      step_1_compliance_rate: 92,
      step_2_compliance_rate: 85,
      step_3_compliance_rate: 88,
      step_4_compliance_rate: 90,
      overall_process_deviation_score: 12,
      deviation_details: [
        {
          step: 2,
          issue: "proposal_insufficient_detail",
          frequency: 15,
        },
      ],
    }),
    analyzeContractCorrelation: jest.fn().mockResolvedValue({
      correlation_coefficient: 0.82,
      success_pattern_1: {
        name: "Early_Frequent_Contact",
        win_rate: 78,
        sample_size: 45,
      },
      success_pattern_2: {
        name: "Multi_Stakeholder_Engagement",
        win_rate: 71,
        sample_size: 38,
      },
      analysis_confidence_score: 94,
    }),
    generateAnalysisReport: jest.fn().mockResolvedValue({
      report_id: "RPT20240115001",
      generated_timestamp: "2024-01-15T13:00:00Z",
      target_month: "2024-01",
      manager_id: "MGR001",
      analysis_results: {
        quality_check: {
          score: 96.5,
          status: "PASSED",
          missing_records: 2,
        },
        behavior_patterns: {
          total_employees_analyzed: 12,
          avg_contact_frequency: 4.1,
          avg_proposal_quality_score: 77,
        },
        process_deviation: {
          overall_compliance_rate: 88.75,
          critical_gaps: 2,
        },
        contract_correlation: {
          top_success_pattern: "Early_Frequent_Contact",
          win_rate_improvement_potential: 12,
        },
      },
      improvement_proposals: [
        {
          category: "process_fix",
          priority: "HIGH",
          description: "Enhance proposal detail requirements at step 2",
          expected_impact: "5% win rate improvement",
        },
        {
          category: "individual_coaching",
          target_employees: ["EMP003", "EMP007"],
          focus_area: "step_2_compliance",
          priority: "HIGH",
        },
        {
          category: "new_success_pattern",
          pattern_name: "Early_Frequent_Contact",
          applicability_rate: 78,
          priority: "MEDIUM",
        },
      ],
      metadata: {
        data_source_identifiers: ["DB_SALES_001", "DB_BEHAVIOR_001"],
        calculation_logic: {
          quality_score_formula: "completeness * format_validity * uniqueness",
          deviation_formula: "1 - (actual_compliance_rate / expected_rate)",
          correlation_formula: "Pearson correlation coefficient",
        },
        ai_inference_confidence: 94,
        analysis_execution_timestamp: "2024-01-15T13:00:00Z",
      },
      access_control: {
        manager_id: "MGR001",
        view_permission: true,
        edit_permission: false,
      },
    }),
    recordAuditEvent: jest.fn().mockResolvedValue({
      event_id: "EVT20240115001",
      recorded_at: "2024-01-15T13:00:00Z",
    }),
  };
};

describe("営業データ分析から乖離検出までの自律実行 AIエージェント", () => {
  let mockAiClient: Tx12Imp1AiClient;
  let auditEvents: Array<{
    action_name: string;
    timestamp: string;
    status: string;
  }> = [];

  beforeEach(() => {
    mockAiClient = createMockTx12Imp1AiClient();
    auditEvents = [];
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-1309
  test("should execute autonomous monthly data analysis workflow with trigger confirmation, data validation, behavior pattern analysis, process deviation detection, correlation analysis, and report generation", async () => {
    // Setup
    const monthlyMeetingTrigger = {
      trigger_type: "MONTHLY_MEETING",
      meeting_datetime: "2024-01-15T14:00:00Z",
      target_month: "2024-01",
      manager_id: "MGR001",
    };

    // Action 1: Confirm monthly meeting trigger
    const triggerConfirmation = await mockAiClient.confirmMonthlyMeetingTrigger(
      monthlyMeetingTrigger
    );
    expect(triggerConfirmation.trigger_status).toBe("CONFIRMED");
    expect(triggerConfirmation.confirmed_at).toBe("2024-01-15T11:00:00Z");
    auditEvents.push({
      action_name: "confirm_monthly_meeting_trigger",
      timestamp: triggerConfirmation.confirmed_at,
      status: triggerConfirmation.trigger_status,
    });

    // Action 2: Extract and validate monthly operational data
    const dataValidationResult =
      await mockAiClient.extractAndValidateMonthlyData({
        target_month: "2024-01",
        data_extraction_scope: "all_sales_activities",
      });
    expect(dataValidationResult.data_quality_score).toBeGreaterThanOrEqual(95);
    expect(dataValidationResult.validation_status).toBe("PASSED");
    expect(dataValidationResult.missing_value_count).toBe(2);
    expect(dataValidationResult.format_error_count).toBe(1);
    expect(dataValidationResult.duplicate_detection_count).toBe(3);
    expect(dataValidationResult.total_records).toBe(500);
    auditEvents.push({
      action_name: "extract_and_validate_monthly_data",
      timestamp: "2024-01-15T12:00:00Z",
      status: dataValidationResult.validation_status,
    });

    // Action 3: Analyze employee behavior patterns
    const behaviorAnalysisResult =
      await mockAiClient.analyzeEmployeeBehaviorPatterns({
        employee_ids: ["EMP001"],
        analysis_period: "2024-01",
        behavioral_dimensions: [
          "contact_frequency",
          "proposal_content",
          "followup_timing",
        ],
      });
    expect(behaviorAnalysisResult.contact_frequency_avg).toBe(4.2);
    expect(behaviorAnalysisResult.proposal_content_diversity_score).toBe(78);
    expect(behaviorAnalysisResult.followup_interval_days_avg).toBe(5.3);
    expect(behaviorAnalysisResult.behavior_analysis_timestamp).toBe(
      "2024-01-15T12:00:00Z"
    );
    auditEvents.push({
      action_name: "analyze_employee_behavior_patterns",
      timestamp: behaviorAnalysisResult.behavior_analysis_timestamp,
      status: "COMPLETED",
    });

    // Action 4: Analyze process deviation
    const processDeviationResult =
      await mockAiClient.analyzeProcessDeviation({
        standard_process_definition_id: "PROC_STANDARD_001",
        actual_behavior_data: behaviorAnalysisResult,
        target_month: "2024-01",
      });
    expect(processDeviationResult.step_1_compliance_rate).toBe(92);
    expect(processDeviationResult.step_2_compliance_rate).toBe(85);
    expect(processDeviationResult.step_3_compliance_rate).toBe(88);
    expect(processDeviationResult.step_4_compliance_rate).toBe(90);
    expect(processDeviationResult.overall_process_deviation_score).toBe(12);
    expect(processDeviationResult.deviation_details).toHaveLength(1);
    expect(processDeviationResult.deviation_details[0].step).toBe(2);
    expect(processDeviationResult.deviation_details[0].frequency).toBe(15);
    auditEvents.push({
      action_name: "analyze_process_deviation",
      timestamp: "2024-01-15T12:30:00Z",
      status: "COMPLETED",
    });

    // Action 5: Analyze contract correlation
    const contractCorrelationResult =
      await mockAiClient.analyzeContractCorrelation({
        behavior_patterns: behaviorAnalysisResult,
        contract_outcomes: {
          total_contracts: 120,
          won_contracts: 95,
          analysis_period: "2024-01",
        },
        success_pattern_extraction_enabled: true,
      });
    expect(contractCorrelationResult.correlation_coefficient).toBe(0.82);
    expect(contractCorrelationResult.success_pattern_1.name).toBe(
      "Early_Frequent_Contact"
    );
    expect(contractCorrelationResult.success_pattern_1.win_rate).toBe(78);
    expect(contractCorrelationResult.success_pattern_1.sample_size).toBe(45);
    expect(contractCorrelationResult.success_pattern_2.name).toBe(
      "Multi_Stakeholder_Engagement"
    );
    expect(contractCorrelationResult.success_pattern_2.win_rate).toBe(71);
    expect(contractCorrelationResult.success_pattern_2.sample_size).toBe(38);
    expect(contractCorrelationResult.analysis_confidence_score).toBe(94);
    auditEvents.push({
      action_name: "analyze_contract_correlation",
      timestamp: "2024-01-15T13:00:00Z",
      status: "COMPLETED",
    });

    // Action 6: Generate comprehensive analysis report
    const reportGeneration = await mockAiClient.generateAnalysisReport({
      quality_check_result: dataValidationResult,
      behavior_analysis_result: behaviorAnalysisResult,
      process_deviation_result: processDeviationResult,
      correlation_analysis_result: contractCorrelationResult,
      manager_id: monthlyMeetingTrigger.manager_id,
      target_month: monthlyMeetingTrigger.target_month,
    });

    expect(reportGeneration.report_id).toBe("RPT20240115001");
    expect(reportGeneration.generated_timestamp).toBe("2024-01-15T13:00:00Z");
    expect(reportGeneration.target_month).toBe("2024-01");
    expect(reportGeneration.manager_id).toBe("MGR001");

    // Verify analysis results are integrated
    expect(reportGeneration.analysis_results.quality_check.score).toBe(96.5);
    expect(reportGeneration.analysis_results.quality_check.status).toBe(
      "PASSED"
    );
    expect(reportGeneration.analysis_results.behavior_patterns.total_employees_analyzed).toBe(
      12
    );
    expect(reportGeneration.analysis_results.behavior_patterns.avg_contact_frequency).toBe(
      4.1
    );
    expect(reportGeneration.analysis_results.behavior_patterns.avg_proposal_quality_score).toBe(
      77
    );
    expect(reportGeneration.analysis_results.process_deviation.overall_compliance_rate).toBe(
      88.75
    );
    expect(reportGeneration.analysis_results.process_deviation.critical_gaps).toBe(
      2
    );
    expect(reportGeneration.analysis_results.contract_correlation.top_success_pattern).toBe(
      "Early_Frequent_Contact"
    );
    expect(reportGeneration.analysis_results.contract_correlation.win_rate_improvement_potential).toBe(
      12
    );

    // Verify improvement proposals structure
    expect(reportGeneration.improvement_proposals).toHaveLength(3);
    expect(reportGeneration.improvement_proposals[0].category).toBe(
      "process_fix"
    );
    expect(reportGeneration.improvement_proposals[0].priority).toBe("HIGH");
    expect(reportGeneration.improvement_proposals[0].description).toBe(
      "Enhance proposal detail requirements at step 2"
    );
    expect(reportGeneration.improvement_proposals[0].expected_impact).toBe(
      "5% win rate improvement"
    );

    expect(reportGeneration.improvement_proposals[1].category).toBe(
      "individual_coaching"
    );
    expect(reportGeneration.improvement_proposals[1].target_employees).toEqual([
      "EMP003",
      "EMP007",
    ]);
    expect(reportGeneration.improvement_proposals[1].focus_area).toBe(
      "step_2_compliance"
    );

    expect(reportGeneration.improvement_proposals[2].category).toBe(
      "new_success_pattern"
    );
    expect(reportGeneration.improvement_proposals[2].pattern_name).toBe(
      "Early_Frequent_Contact"
    );
    expect(reportGeneration.improvement_proposals[2].applicability_rate).toBe(
      78
    );

    // Verify metadata is recorded
    expect(reportGeneration.metadata.data_source_identifiers).toContain(
      "DB_SALES_001"
    );
    expect(reportGeneration.metadata.data_source_identifiers).toContain(
      "DB_BEHAVIOR_001"
    );
    expect(reportGeneration.metadata.calculation_logic.quality_score_formula).toBe(
      "completeness * format_validity * uniqueness"
    );
    expect(reportGeneration.metadata.calculation_logic.deviation_formula).toBe(
      "1 - (actual_compliance_rate / expected_rate)"
    );
    expect(reportGeneration.metadata.calculation_logic.correlation_formula).toBe(
      "Pearson correlation coefficient"
    );
    expect(reportGeneration.metadata.ai_inference_confidence).toBe(94);
    expect(reportGeneration.metadata.analysis_execution_timestamp).toBe(
      "2024-01-15T13:00:00Z"
    );

    // Verify access control metadata
    expect(reportGeneration.access_control.manager_id).toBe("MGR001");
    expect(reportGeneration.access_control.view_permission).toBe(true);
    expect(reportGeneration.access_control.edit_permission).toBe(false);

    // Action 7: Record audit events
    await mockAiClient.recordAuditEvent({
      event_log: auditEvents,
      orchestration_session_id: "SESSION20240115001",
      timestamp: "2024-01-15T13:00:00Z",
    });

    // Verify all autonomous actions are recorded
    expect(auditEvents).toHaveLength(6);
    expect(auditEvents[0].action_name).toBe("confirm_monthly_meeting_trigger");
    expect(auditEvents[0].status).toBe("CONFIRMED");
    expect(auditEvents[1].action_name).toBe(
      "extract_and_validate_monthly_data"
    );
    expect(auditEvents[1].status).toBe("PASSED");
    expect(auditEvents[2].action_name).toBe(
      "analyze_employee_behavior_patterns"
    );
    expect(auditEvents[2].status).toBe("COMPLETED");
    expect(auditEvents[3].action_name).toBe("analyze_process_deviation");
    expect(auditEvents[3].status).toBe("COMPLETED");
    expect(auditEvents[4].action_name).toBe("analyze_contract_correlation");
    expect(auditEvents[4].status).toBe("COMPLETED");
    expect(auditEvents[5].action_name).toBe("record_audit_event");
    expect(auditEvents[5].status).toBe("COMPLETED");

    // Verify execution was called
    expect(mockAiClient.confirmMonthlyMeetingTrigger).toHaveBeenCalledWith(
      monthlyMeetingTrigger
    );
    expect(mockAiClient.extractAndValidateMonthlyData).toHaveBeenCalled();
    expect(mockAiClient.analyzeEmployeeBehaviorPatterns).toHaveBeenCalled();
    expect(mockAiClient.analyzeProcessDeviation).toHaveBeenCalled();
    expect(mockAiClient.analyzeContractCorrelation).toHaveBeenCalled();
    expect(mockAiClient.generateAnalysisReport).toHaveBeenCalled();
    expect(mockAiClient.recordAuditEvent).toHaveBeenCalled();
  });
});