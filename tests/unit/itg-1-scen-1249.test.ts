import { runTx2Imp2Agent } from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス遵守状況の自動監視と改善提案の実行 AIエージェント", () => {
  test("SCEN-1249: AIの推論精度が基準以下の場合にエスカレーション引き継ぎを実行", async () => {
    fetchMock.resetMocks();

    const mockSalesActivityData = {
      sales_rep_id: "REP-001",
      sales_rep_name: "営業担当者A",
      compliance_rate: 0.7,
      process_step_adherence: {
        initial_contact: 0.65,
        proposal: 0.75,
        negotiation: 0.68,
        closing: 0.72,
      },
      improvement_opportunities: [
        {
          opportunity_id: "OPP-001",
          process_step: "initial_contact",
          description: "初回接触頻度が低い",
          severity: "high",
        },
        {
          opportunity_id: "OPP-002",
          process_step: "proposal",
          description: "提案資料の準備不足",
          severity: "medium",
        },
      ],
    };

    const mockImprovedProposal = {
      proposal_id: "PROP-001",
      sales_rep_id: "REP-001",
      recommendation_content: "初回接触前に顧客ニーズ調査を追加実施してください",
      success_pattern_match: 0.78,
      confidence_score: 0.85,
      inference_accuracy: 0.94,
      timestamp: "2024-01-15T10:30:00Z",
    };

    const mockAiClient = {
      analyzeProcessCompliance: jest
        .fn()
        .mockResolvedValue(mockSalesActivityData),
      generateImprovementProposal: jest
        .fn()
        .mockResolvedValue(mockImprovedProposal),
      evaluateInferenceAccuracy: jest.fn().mockResolvedValue({
        accuracy_score: 0.94,
        threshold: 0.95,
        meets_threshold: false,
        timestamp: "2024-01-15T10:30:00Z",
      }),
    };

    const mockNotificationService = {
      notifySalesRep: jest.fn(),
      notifyManager: jest.fn(),
    };

    const mockAuditLogger = {
      logEscalation: jest.fn(),
    };

    const mockDashboardService = {
      updateDashboardStatus: jest.fn(),
    };

    const result = await runTx2Imp2Agent(
      {
        target_period_start: "2024-01-01T00:00:00Z",
        target_period_end: "2024-01-31T23:59:59Z",
        sales_reps: ["REP-001"],
      },
      mockAiClient,
      mockNotificationService,
      mockAuditLogger,
      mockDashboardService
    );

    expect(result).toEqual({
      status: "AWAITING_HUMAN_REVIEW",
      escalation_reason: "推論精度が基準95%未満",
      inference_accuracy: 0.94,
      threshold: 0.95,
      handoff_data: {
        sales_rep_id: "REP-001",
        sales_rep_name: "営業担当者A",
        compliance_rate: 0.7,
        improvement_proposal: {
          proposal_id: "PROP-001",
          recommendation_content:
            "初回接触前に顧客ニーズ調査を追加実施してください",
          confidence_score: 0.85,
        },
        improvement_opportunities: [
          {
            opportunity_id: "OPP-001",
            process_step: "initial_contact",
            description: "初回接触頻度が低い",
            severity: "high",
          },
          {
            opportunity_id: "OPP-002",
            process_step: "proposal",
            description: "提案資料の準備不足",
            severity: "medium",
          },
        ],
        inference_accuracy: 0.94,
        review_status: "AWAITING_HUMAN_REVIEW",
        timestamp: "2024-01-15T10:30:00Z",
      },
      autonomous_actions_executed: [
        "analyzeProcessCompliance",
        "generateImprovementProposal",
        "evaluateInferenceAccuracy",
      ],
      deferred_side_effects: [
        "notifySalesRep",
        "notifyManager",
        "updateDashboardAutomatically",
      ],
    });

    expect(mockAuditLogger.logEscalation).toHaveBeenCalledWith({
      event_type: "ESCALATION_INFERENCE_ACCURACY_LOW",
      timestamp: "2024-01-15T10:30:00Z",
      inference_accuracy: 0.94,
      threshold: 0.95,
      escalation_reason: "推論精度が基準95%未満",
      sales_rep_id: "REP-001",
      status: "AWAITING_HUMAN_REVIEW",
    });

    expect(mockNotificationService.notifySalesRep).not.toHaveBeenCalled();
    expect(mockNotificationService.notifyManager).not.toHaveBeenCalled();

    expect(mockDashboardService.updateDashboardStatus).not.toHaveBeenCalledWith(
      expect.objectContaining({
        status: "UPDATE_COMPLETE",
      })
    );
  });
});