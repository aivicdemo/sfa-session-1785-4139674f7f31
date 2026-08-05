import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/agents/tx-10-imp-1/orchestrator";
import type { Tx10Imp1AiClient } from "../../src/agents/tx-10-imp-1/ai-client";

const mockFetch = require("jest-fetch-mock");

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  beforeEach(() => {
    mockFetch.resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1282
  test("[error] 営業データ入力から問題検出・通知までの自律実行 - データ品質スコア閾値以下でエスカレーション", async () => {
    // ===== Setup =====
    const input_sales_data = {
      sales_activity_id: "ACT-20240115-001",
      salesperson_id: "SP-0042",
      customer_id: "CUST-1001",
      proposal_content: "SaaS契約年1,200万円",
      activity_type: "提案",
      interaction_date: "2024-01-15T10:30:00Z",
      follow_up_interval_days: 3,
      required_fields_complete: true,
      customer_data_contradiction: false,
    };

    const threshold_data_quality_score = 80;
    const detected_data_quality_score = 65;
    const escalation_triggered_flag = detected_data_quality_score < threshold_data_quality_score;

    const mock_ai_client: Partial<Tx10Imp1AiClient> = {
      validateDataCompleteness: jest.fn().mockResolvedValue({
        is_valid: true,
        missing_fields: [],
      }),
      checkCustomerDataContradiction: jest.fn().mockResolvedValue({
        has_contradiction: false,
        contradiction_details: [],
      }),
      analyzeProposalContent: jest.fn().mockResolvedValue({
        success_pattern_match_score: 0.75,
        risk_factors: [],
      }),
      detectInappropriatePatterns: jest.fn().mockResolvedValue({
        patterns_detected: [],
        overall_risk_level: "low",
      }),
      calculateDataQualityScore: jest.fn().mockResolvedValue({
        quality_score: detected_data_quality_score,
        quality_threshold: threshold_data_quality_score,
        issues: [
          {
            field: "proposal_content",
            issue: "incomplete_business_context",
            severity: "medium",
          },
          {
            field: "follow_up_interval_days",
            issue: "insufficient_frequency",
            severity: "medium",
          },
        ],
      }),
    };

    const mock_escalation_handler = jest.fn().mockResolvedValue({
      escalation_event_id: "ESC-20240115-001",
      status: "REVIEW_PENDING",
      timestamp: "2024-01-15T11:00:00Z",
    });

    const mock_audit_logger = {
      logEscalationInitiated: jest.fn(),
    };

    // ===== Execution =====
    const result = await runTx10Imp1Agent(
      input_sales_data,
      mock_ai_client as Tx10Imp1AiClient,
      {
        handleEscalation: mock_escalation_handler,
        auditLogger: mock_audit_logger,
      }
    );

    // ===== Assertions =====

    // 1. 必須項目の完全性検証が実行されたことを確認
    expect(mock_ai_client.validateDataCompleteness).toHaveBeenCalledWith(
      input_sales_data
    );

    // 2. 既存顧客データの重複・矛盾チェックが実行されたことを確認
    expect(mock_ai_client.checkCustomerDataContradiction).toHaveBeenCalledWith({
      customer_id: input_sales_data.customer_id,
      input_data: input_sales_data,
    });

    // 3. 提案内容の分析が実行されたことを確認
    expect(mock_ai_client.analyzeProposalContent).toHaveBeenCalledWith(
      input_sales_data.proposal_content
    );

    // 4. 不適切パターン検出処理が実行されたことを確認
    expect(mock_ai_client.detectInappropriatePatterns).toHaveBeenCalledWith({
      proposal_analysis: expect.any(Object),
      sales_history: expect.any(Object),
    });

    // 5. データ品質スコア計算が実行されたことを確認
    expect(mock_ai_client.calculateDataQualityScore).toHaveBeenCalledWith(
      input_sales_data
    );

    // 6. データ品質スコア（65）が設定閾値（80）以下であることを確認
    expect(escalation_triggered_flag).toBe(true);
    expect(detected_data_quality_score).toBeLessThan(threshold_data_quality_score);

    // 7. エスカレーション条件に該当することを確認
    expect(result.escalation_condition_met).toBe(true);
    expect(result.escalation_reason).toBe(
      `data_quality_score_below_threshold:${detected_data_quality_score}/${threshold_data_quality_score}`
    );

    // 8. エスカレーションハンドラが呼ばれたことを確認
    expect(mock_escalation_handler).toHaveBeenCalled();

    // 9. 人への引き継ぎイベントペイロードが正しいことを確認
    const escalation_call_args = mock_escalation_handler.mock.calls[0][0];
    expect(escalation_call_args).toEqual({
      status: "REVIEW_PENDING",
      case_id: input_sales_data.sales_activity_id,
      quality_score: detected_data_quality_score,
      threshold: threshold_data_quality_score,
      escalation_reason: `data_quality_score_below_threshold:${detected_data_quality_score}/${threshold_data_quality_score}`,
      handover_user_role: "manager",
      preliminary_notification_sent: true,
    });

    // 10. 監査ログに『ESCALATION_INITIATED』が記録されたことを確認
    expect(mock_audit_logger.logEscalationInitiated).toHaveBeenCalled();
    const audit_log_args = mock_audit_logger.logEscalationInitiated.mock
      .calls[0][0];
    expect(audit_log_args).toMatchObject({
      event_type: "ESCALATION_INITIATED",
      case_id: input_sales_data.sales_activity_id,
      escalation_reason: `data_quality_score_below_threshold:${detected_data_quality_score}/${threshold_data_quality_score}`,
      handover_role: "manager",
    });
    expect(audit_log_args.timestamp).toBeDefined();
    expect(typeof audit_log_args.timestamp).toBe("string");

    // 11. 副作用（通知送信、対応記録の確定）が実行されていないことを確認
    // アラート通知送信関数が呼ばれていないことを確認
    expect(result.alert_notification_sent).toBe(false);
    // 対応記録の確定が実行されていないことを確認
    expect(result.response_record_finalized).toBe(false);
    // トランザクションが保留状態であることを確認
    expect(result.transaction_status).toBe("PENDING_REVIEW");

    // 12. 結果オブジェクト全体の構造を確認
    expect(result).toMatchObject({
      sales_activity_id: input_sales_data.sales_activity_id,
      escalation_condition_met: true,
      escalation_reason: expect.stringContaining(
        "data_quality_score_below_threshold"
      ),
      status: "REVIEW_PENDING",
      alert_notification_sent: false,
      response_record_finalized: false,
      transaction_status: "PENDING_REVIEW",
      escalation_event_id: "ESC-20240115-001",
    });
  });
});