import { runTx12Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1316
  test("営業データ分析から乖離検出までの自律実行 - 品質スコア低下時は人へ引き継ぐ", async () => {
    const mockAiClient = {
      analyzeDataQuality: jest.fn().mockResolvedValue({
        quality_score: 92,
        baseline_threshold: 95,
        missing_value_count: 15,
        format_error_count: 3,
        duplicate_record_count: 2,
        passed: false,
      }),
      analyzeActionPatterns: jest.fn(),
      analyzeDriftFromStandardProcess: jest.fn(),
      analyzeCorrelationWithContracts: jest.fn(),
      generateImprovementProposals: jest.fn(),
    };

    const auditLog: Array<{
      timestamp: string;
      agent_execution_id: string;
      escalation_reason: string;
      handoff_target: string;
      side_effect_confirmed: boolean;
    }> = [];

    const mockAuditLogger = {
      log: jest.fn((entry) => {
        auditLog.push(entry);
      }),
    };

    const triggerInput = {
      trigger_type: "monthly_sales_meeting",
      triggered_at: "2024-01-15T09:00:00Z",
      organization_id: "org_001",
      manager_id: "mgr_001",
    };

    const result = await runTx12Imp1Agent(
      triggerInput,
      mockAiClient,
      mockAuditLogger
    );

    expect(result.status).toBe("escalated");
    expect(result.escalation_reason).toBe(
      "quality_score_below_baseline"
    );
    expect(result.quality_check_result.quality_score).toBe(92);
    expect(result.quality_check_result.baseline_threshold).toBe(95);
    expect(result.quality_check_result.passed).toBe(false);

    expect(result.handoff_notification).toEqual({
      recipient: "manager",
      quality_score: 92,
      baseline_threshold: 95,
      quality_issues: {
        missing_values: 15,
        format_errors: 3,
        duplicates: 2,
      },
      message:
        "品質スコア 92% / 基準値 95% / 不合格理由：欠損値 15件、形式エラー 3件、重複 2件",
      created_at: "2024-01-15T09:00:00Z",
    });

    expect(result.system_state).toBe("awaiting_human_confirmation");
    expect(result.autonomous_execution_halted).toBe(true);

    expect(mockAiClient.analyzeActionPatterns).not.toHaveBeenCalled();
    expect(
      mockAiClient.analyzeDriftFromStandardProcess
    ).not.toHaveBeenCalled();
    expect(mockAiClient.analyzeCorrelationWithContracts).not.toHaveBeenCalled();
    expect(
      mockAiClient.generateImprovementProposals
    ).not.toHaveBeenCalled();

    expect(auditLog.length).toBeGreaterThan(0);
    const escalationAuditEntry = auditLog.find(
      (entry) => entry.escalation_reason === "quality_score_below_baseline"
    );
    expect(escalationAuditEntry).toBeDefined();
    expect(escalationAuditEntry?.timestamp).toBe("2024-01-15T09:00:00Z");
    expect(escalationAuditEntry?.handoff_target).toBe("manager");
    expect(escalationAuditEntry?.side_effect_confirmed).toBe(false);

    expect(result.report_generated).toBe(false);
    expect(result.improvement_proposals).toBeUndefined();
  });
});