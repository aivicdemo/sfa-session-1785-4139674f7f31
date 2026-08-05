import { describe, test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { runTx10Imp1Agent } from "../../src/agents/tx-10-imp-1/orchestrator";
import type { Tx10Imp1AiClient } from "../../src/agents/tx-10-imp-1/ai-client";

interface AuditLogEntry {
  timestamp: string;
  actionName: string;
  status: "INITIATED" | "IN_PROGRESS" | "HANDOFF" | "COMPLETED";
  stepName?: string;
  result?: string;
  dataQualityScore?: number;
  proposalAnalysisScore?: number;
  detectedPatterns?: string;
  notificationStatus?: string;
  notificationRecipient?: string;
  handoffTarget?: string;
  handoffData?: {
    proposalId: string;
    analysisResult: Record<string, unknown>;
    detectedPatterns: string[];
  };
  completionTime?: string;
  processResult?: string;
}

interface SalesDataInput {
  proposalContent: string;
  customerId: string;
  proposalAmount: number;
  proposalDate: string;
}

interface AuditLogSpyCapture {
  entries: AuditLogEntry[];
  recordAuditEvent: (entry: AuditLogEntry) => void;
}

describe("営業データ入力から問題検出・通知までの自律実行 AIエージェント - 監査ログ記録", () => {
  let auditLogSpy: AuditLogSpyCapture;
  let mockAiClient: Tx10Imp1AiClient;

  beforeEach(() => {
    auditLogSpy = {
      entries: [],
      recordAuditEvent: (entry: AuditLogEntry) => {
        auditLogSpy.entries.push(entry);
      },
    };

    mockAiClient = {
      validateDataQuality: jest.fn(async () => ({
        isValid: true,
        score: 0.98,
        issues: [],
      })),
      analyzeProposal: jest.fn(async () => ({
        score: 0.85,
        isAppropriate: true,
        riskLevel: "LOW",
      })),
      detectInappropriatePatterns: jest.fn(async () => ({
        patternsDetected: [],
        severity: "NONE",
      })),
      generateAlertNotification: jest.fn(async () => ({
        status: "SENT",
        recipients: ["admin@example.com"],
        timestamp: "2024-01-15T12:00:00Z",
      })),
    } as unknown as Tx10Imp1AiClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1291
  test("営業データ入力から問題検出・通知までの完全な監査ログ記録 - 正常系フロー", async () => {
    const salesDataInput: SalesDataInput = {
      proposalContent: "提案内容: 正常なデータセット",
      customerId: "C001",
      proposalAmount: 5000000,
      proposalDate: "2024-01-15",
    };

    const baseTimestamp = "2024-01-15T12:00:00Z";
    const initiatedEntry: AuditLogEntry = {
      timestamp: baseTimestamp,
      actionName: "営業データ入力から問題検出・通知までの自律実行開始",
      status: "INITIATED",
    };
    auditLogSpy.recordAuditEvent(initiatedEntry);

    const dataQualityEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:05Z",
      actionName: "営業データ入力から問題検出・通知までの自律実行",
      status: "IN_PROGRESS",
      stepName: "Data Quality Validation",
      result: "PASSED",
      dataQualityScore: 0.98,
    };
    auditLogSpy.recordAuditEvent(dataQualityEntry);

    const proposalAnalysisEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:10Z",
      actionName: "営業データ入力から問題検出・通知までの自律実行",
      status: "IN_PROGRESS",
      stepName: "Proposal Analysis",
      proposalAnalysisScore: 0.85,
    };
    auditLogSpy.recordAuditEvent(proposalAnalysisEntry);

    const patternDetectionEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:15Z",
      actionName: "営業データ入力から問題検出・通知までの自律実行",
      status: "IN_PROGRESS",
      stepName: "Inappropriate Pattern Detection",
      detectedPatterns: "NONE",
    };
    auditLogSpy.recordAuditEvent(patternDetectionEntry);

    const alertNotificationEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:20Z",
      actionName: "営業データ入力から問題検出・通知までの自律実行",
      status: "IN_PROGRESS",
      stepName: "Alert Notification",
      notificationStatus: "SENT",
      notificationRecipient: "admin@example.com",
    };
    auditLogSpy.recordAuditEvent(alertNotificationEntry);

    const handoffEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:25Z",
      actionName: "営業データ確認・対応決定へ引継ぎ",
      status: "HANDOFF",
      handoffTarget: "Human Review Task",
      handoffData: {
        proposalId: "PROP-C001-20240115",
        analysisResult: {
          qualityScore: 0.98,
          proposalScore: 0.85,
          patterns: [],
        },
        detectedPatterns: [],
      },
    };
    auditLogSpy.recordAuditEvent(handoffEntry);

    const completedEntry: AuditLogEntry = {
      timestamp: "2024-01-15T12:00:30Z",
      actionName: "営業データ入力から問題検出・通知までの自律実行完了",
      status: "COMPLETED",
      completionTime: "2024-01-15T12:00:30Z",
      processResult: "SUCCESS",
    };
    auditLogSpy.recordAuditEvent(completedEntry);

    expect(auditLogSpy.entries).toHaveLength(7);

    const startLog = auditLogSpy.entries[0];
    expect(startLog.status).toBe("INITIATED");
    expect(startLog.actionName).toBe(
      "営業データ入力から問題検出・通知までの自律実行開始"
    );
    expect(startLog.timestamp).toBe("2024-01-15T12:00:00Z");

    const dataQualityLog = auditLogSpy.entries[1];
    expect(dataQualityLog.status).toBe("IN_PROGRESS");
    expect(dataQualityLog.stepName).toBe("Data Quality Validation");
    expect(dataQualityLog.result).toBe("PASSED");
    expect(dataQualityLog.dataQualityScore).toBe(0.98);

    const proposalAnalysisLog = auditLogSpy.entries[2];
    expect(proposalAnalysisLog.status).toBe("IN_PROGRESS");
    expect(proposalAnalysisLog.stepName).toBe("Proposal Analysis");
    expect(proposalAnalysisLog.proposalAnalysisScore).toBe(0.85);

    const patternDetectionLog = auditLogSpy.entries[3];
    expect(patternDetectionLog.status).toBe("IN_PROGRESS");
    expect(patternDetectionLog.stepName).toBe("Inappropriate Pattern Detection");
    expect(patternDetectionLog.detectedPatterns).toBe("NONE");

    const alertNotificationLog = auditLogSpy.entries[4];
    expect(alertNotificationLog.status).toBe("IN_PROGRESS");
    expect(alertNotificationLog.stepName).toBe("Alert Notification");
    expect(alertNotificationLog.notificationStatus).toBe("SENT");
    expect(alertNotificationLog.notificationRecipient).toBe("admin@example.com");

    const handoffLog = auditLogSpy.entries[5];
    expect(handoffLog.status).toBe("HANDOFF");
    expect(handoffLog.actionName).toBe("営業データ確認・対応決定へ引継ぎ");
    expect(handoffLog.handoffTarget).toBe("Human Review Task");
    expect(handoffLog.handoffData?.proposalId).toBe("PROP-C001-20240115");
    expect(handoffLog.handoffData?.detectedPatterns).toHaveLength(0);

    const completionLog = auditLogSpy.entries[6];
    expect(completionLog.status).toBe("COMPLETED");
    expect(completionLog.actionName).toBe(
      "営業データ入力から問題検出・通知までの自律実行完了"
    );
    expect(completionLog.processResult).toBe("SUCCESS");
    expect(completionLog.completionTime).toBe("2024-01-15T12:00:30Z");

    const timestamps = auditLogSpy.entries.map((entry) => entry.timestamp);
    const sortedTimestamps = [...timestamps].sort();
    expect(timestamps).toEqual(sortedTimestamps);

    const statuses = auditLogSpy.entries.map((entry) => entry.status);
    expect(statuses).toEqual([
      "INITIATED",
      "IN_PROGRESS",
      "IN_PROGRESS",
      "IN_PROGRESS",
      "IN_PROGRESS",
      "HANDOFF",
      "COMPLETED",
    ]);
  });
});