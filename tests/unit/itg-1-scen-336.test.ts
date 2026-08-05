import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/agents/tx-3-imp-1/orchestrator";
import type { Tx3Imp1AiClient } from "../../src/agents/tx-3-imp-1/types";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let mockAiClient: Tx3Imp1AiClient;
  let auditLogCapture: Array<{
    timestamp: string;
    eventType: string;
    systemName: string;
    errorCode: string;
    errorMessage: string;
  }>;

  beforeEach(() => {
    auditLogCapture = [];

    mockAiClient = {
      analyzeHealthStatus: jest.fn().mockRejectedValue({
        code: "SYSTEM_UNREACHABLE",
        message: "Failed to connect to target system",
        systemId: "sales_process_monitor_01",
        statusCode: 503,
        errorType: "ConnectionRefused",
      }),
      analyzeDataQuality: jest.fn(),
      analyzeInferenceAccuracy: jest.fn(),
      aggregateAndPrioritize: jest.fn(),
      recordAuditEvent: jest.fn().mockImplementation((event) => {
        auditLogCapture.push({
          timestamp: event.timestamp,
          eventType: event.eventType,
          systemName: event.systemName,
          errorCode: event.errorCode,
          errorMessage: event.errorMessage,
        });
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-336: [error] システムヘルスチェック実行機能 - チェック対象システムが実際には停止している状態のとき、エラーが発生する
  test("should throw error and record audit log when target system is down during health check", async () => {
    const triggerId = "monthly_check_2024_01_15";
    const systemsToCheck = ["sales_process_monitor_01"];
    const checkTimestamp = "2024-01-15T09:00:00Z";

    let thrownError: any;
    let orchestratorResult: any;

    try {
      orchestratorResult = await runTx3Imp1Agent({
        aiClient: mockAiClient,
        triggerId,
        systemsToCheck,
        checkTimestamp,
      });
    } catch (error) {
      thrownError = error;
    }

    if (!thrownError && !orchestratorResult?.error) {
      throw new Error("Expected runTx3Imp1Agent to throw or return error status");
    }

    const actualError = thrownError || orchestratorResult?.error;

    expect(actualError).toBeDefined();
    expect(actualError.code).toBe("SYSTEM_UNREACHABLE");
    expect(actualError.systemId).toBe("sales_process_monitor_01");
    expect(actualError.statusCode).toBe(503);
    expect(actualError.errorType).toMatch(/ConnectionRefused|Timeout|ServiceUnavailable/);

    expect(mockAiClient.analyzeHealthStatus).toHaveBeenCalledWith({
      systemsToCheck,
      checkTimestamp,
    });

    expect(mockAiClient.analyzeDataQuality).not.toHaveBeenCalled();
    expect(mockAiClient.analyzeInferenceAccuracy).not.toHaveBeenCalled();
    expect(mockAiClient.aggregateAndPrioritize).not.toHaveBeenCalled();

    expect(mockAiClient.recordAuditEvent).toHaveBeenCalled();
    const auditCallArgs = (mockAiClient.recordAuditEvent as jest.Mock).mock
      .calls[0][0];

    expect(auditCallArgs.eventType).toBe(
      "ヘルスチェック失敗：対象システム停止状態で接続不可"
    );
    expect(auditCallArgs.systemName).toBe("sales_process_monitor_01");
    expect(auditCallArgs.errorCode).toBe("SYSTEM_UNREACHABLE");
    expect(auditCallArgs.errorMessage).toMatch(/接続|停止|到達不可/);

    expect(auditLogCapture.length).toBeGreaterThan(0);
    const recordedEvent = auditLogCapture[0];
    expect(recordedEvent.eventType).toMatch(/ヘルスチェック失敗|停止状態/);
    expect(recordedEvent.systemName).toBe("sales_process_monitor_01");
    expect(recordedEvent.errorCode).toBe("SYSTEM_UNREACHABLE");

    if (thrownError) {
      expect(thrownError instanceof Error || typeof thrownError === "object").toBe(
        true
      );
    } else {
      expect(orchestratorResult.status).toBe("error");
      expect(orchestratorResult.escalationConditionMet).toBe(
        "システムダウンまたは重大障害が検出された"
      );
    }
  });
});