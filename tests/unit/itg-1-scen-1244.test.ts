import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  runTx2Imp2Agent,
  Tx2Imp2AgentInput,
  Tx2Imp2AgentOutput,
} from "../../src/logic/it-1";

const fetchMock = require("jest-fetch-mock");

describe("営業プロセス遵守状況の自動監視と改善提案の実行", () => {
  // SCEN-1244
  test("営業担当者Aへの改善提案が通知・承認・実行追跡まで完結する", async () => {
    fetchMock.resetMocks();

    const sales_rep_a_id = "salesrep_001";
    const manager_b_id = "manager_001";
    const sales_rep_a_email = "sales_rep_a@company.com";
    const manager_b_email = "manager_b@company.com";
    const proposal_id = "prop_20240115_001";
    const compliance_rate = 75;
    const proposal_content =
      "顧客初回接触時間を24時間以内に短縮すること";
    const manager_review_timestamp = new Date("2024-01-15T10:00:00Z");
    const notification_sent_timestamp = new Date("2024-01-15T10:15:00Z");
    const execution_start_timestamp = new Date("2024-01-15T11:00:00Z");

    const mockComplianceAnalysisResponse = {
      sales_rep_id: sales_rep_a_id,
      compliance_rate: compliance_rate,
      improvement_proposals: [
        {
          id: proposal_id,
          content: proposal_content,
          reason:
            "初回接触までの平均時間が36時間で、標準プロセスの24時間を超過しています",
          priority: "high",
          status: "pending_manager_review",
        },
      ],
    };

    const mockManagerApprovalResponse = {
      proposal_id: proposal_id,
      manager_id: manager_b_id,
      approved: true,
      approval_timestamp: manager_review_timestamp.toISOString(),
    };

    const mockNotificationQueueResponse = {
      notification_id: "notif_001",
      recipient_email: sales_rep_a_email,
      proposal_id: proposal_id,
      sent_timestamp: notification_sent_timestamp.toISOString(),
      status: "queued",
    };

    const mockExecutionTrackingResponse = {
      execution_id: "exec_001",
      proposal_id: proposal_id,
      sales_rep_id: sales_rep_a_id,
      execution_status: "started",
      start_timestamp: execution_start_timestamp.toISOString(),
      checklist: [
        "初回接触タイミングを記録",
        "接触までの時間を測定",
        "改善実績を報告",
      ],
    };

    const mockAuditLogResponse = {
      events: [
        {
          event_type: "AgentNotificationSent",
          proposal_id: proposal_id,
          timestamp: notification_sent_timestamp.toISOString(),
        },
        {
          event_type: "ExecutionTrackingInitiated",
          proposal_id: proposal_id,
          timestamp: execution_start_timestamp.toISOString(),
        },
      ],
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockComplianceAnalysisResponse), {
      status: 200,
    });
    fetchMock.mockResponseOnce(JSON.stringify(mockManagerApprovalResponse), {
      status: 200,
    });
    fetchMock.mockResponseOnce(JSON.stringify(mockNotificationQueueResponse), {
      status: 200,
    });
    fetchMock.mockResponseOnce(JSON.stringify(mockExecutionTrackingResponse), {
      status: 200,
    });
    fetchMock.mockResponseOnce(JSON.stringify(mockAuditLogResponse), {
      status: 200,
    });

    const agentInput: Tx2Imp2AgentInput = {
      target_period_start: "2024-01-01",
      target_period_end: "2024-01-15",
      sales_rep_id: sales_rep_a_id,
      manager_id: manager_b_id,
    };

    const result: Tx2Imp2AgentOutput = await runTx2Imp2Agent(agentInput);

    expect(result.success).toBe(true);
    expect(result.compliance_analysis).toBeDefined();
    expect(result.compliance_analysis!.compliance_rate).toBe(compliance_rate);
    expect(result.compliance_analysis!.improvement_proposals).toHaveLength(1);

    const proposal = result.compliance_analysis!.improvement_proposals[0];
    expect(proposal.id).toBe(proposal_id);
    expect(proposal.content).toBe(proposal_content);
    expect(proposal.status).toBe("pending_manager_review");
    expect(proposal.priority).toBe("high");

    expect(result.manager_review).toBeDefined();
    expect(result.manager_review!.proposal_id).toBe(proposal_id);
    expect(result.manager_review!.manager_id).toBe(manager_b_id);
    expect(result.manager_review!.approved).toBe(true);
    expect(result.manager_review!.approval_timestamp).toBe(
      manager_review_timestamp.toISOString()
    );

    expect(result.notification_queue).toBeDefined();
    expect(result.notification_queue!.notification_id).toBe("notif_001");
    expect(result.notification_queue!.recipient_email).toBe(sales_rep_a_email);
    expect(result.notification_queue!.proposal_id).toBe(proposal_id);
    expect(result.notification_queue!.sent_timestamp).toBe(
      notification_sent_timestamp.toISOString()
    );
    expect(result.notification_queue!.status).toBe("queued");

    expect(result.execution_tracking).toBeDefined();
    expect(result.execution_tracking!.execution_id).toBe("exec_001");
    expect(result.execution_tracking!.proposal_id).toBe(proposal_id);
    expect(result.execution_tracking!.sales_rep_id).toBe(sales_rep_a_id);
    expect(result.execution_tracking!.execution_status).toBe("started");
    expect(result.execution_tracking!.start_timestamp).toBe(
      execution_start_timestamp.toISOString()
    );
    expect(result.execution_tracking!.checklist).toHaveLength(3);
    expect(result.execution_tracking!.checklist).toContain("初回接触タイミングを記録");

    expect(result.audit_log_events).toBeDefined();
    expect(result.audit_log_events).toHaveLength(2);

    const notification_sent_event = result.audit_log_events.find(
      (evt) => evt.event_type === "AgentNotificationSent"
    );
    expect(notification_sent_event).toBeDefined();
    expect(notification_sent_event!.proposal_id).toBe(proposal_id);
    expect(notification_sent_event!.timestamp).toBe(
      notification_sent_timestamp.toISOString()
    );

    const execution_tracking_event = result.audit_log_events.find(
      (evt) => evt.event_type === "ExecutionTrackingInitiated"
    );
    expect(execution_tracking_event).toBeDefined();
    expect(execution_tracking_event!.proposal_id).toBe(proposal_id);
    expect(execution_tracking_event!.timestamp).toBe(
      execution_start_timestamp.toISOString()
    );

    expect(result.dashboard_display).toBeDefined();
    expect(result.dashboard_display!.sales_rep_id).toBe(sales_rep_a_id);
    expect(result.dashboard_display!.proposal_summary).toContain("実行中");
    expect(result.dashboard_display!.proposal_summary).toContain(proposal_content);
    expect(result.dashboard_display!.proposal_summary).toContain(sales_rep_a_id);

    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(5);
  });
});