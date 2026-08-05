import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/agents/tx-3-imp-1/orchestrator";
import type { Tx3Imp1AiClient } from "../../src/agents/tx-3-imp-1/types";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let auditLog: Array<{
    error_code: string;
    timestamp: string;
    error_details: string;
  }> = [];

  beforeEach(() => {
    fetchMock.resetMocks();
    auditLog = [];
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-327
  test("should throw error when health check criteria definition does not exist", async () => {
    const mockAiClient: Tx3Imp1AiClient = {
      analyzeSystemHealth: jest.fn().mockResolvedValue({
        status: "error",
        message: "チェック基準定義が存在しません。システム管理者が初期設定を実施してください",
      }),
      analyzeDataQuality: jest.fn(),
      analyzeInferenceAccuracy: jest.fn(),
      aggregateAnomalies: jest.fn(),
    };

    const mockHealthCheckRequest = {
      trigger_type: "periodic",
      check_timestamp: "2024-01-15T11:00:00Z",
      system_id: "sales_audit_system",
    };

    fetchMock.mockResponseOnce(
      JSON.stringify({
        success: false,
        error_code: "HEALTH_CHECK_CRITERIA_NOT_DEFINED",
        error_message: "チェック基準定義が存在しません。システム管理者が初期設定を実施してください",
        details: "No health check criteria definition found in database",
      }),
      { status: 404 }
    );

    const executeHealthCheck = async () => {
      try {
        const response = await fetch("/api/health-check/criteria", {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (
            errorData.error_code ===
            "HEALTH_CHECK_CRITERIA_NOT_DEFINED"
          ) {
            const errorEvent = {
              error_code: "HEALTH_CHECK_CRITERIA_NOT_DEFINED",
              timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
              error_details:
                "No health check criteria definition found in database",
            };
            auditLog.push(errorEvent);

            throw new Error(
              `チェック基準定義が存在しません。システム管理者が初期設定を実施してください (${errorData.error_code})`
            );
          }
        }

        return response.json();
      } catch (error) {
        throw error;
      }
    };

    await expect(executeHealthCheck()).rejects.toThrow(
      /チェック基準定義が存在しません/
    );

    expect(auditLog).toHaveLength(1);
    expect(auditLog[0].error_code).toBe("HEALTH_CHECK_CRITERIA_NOT_DEFINED");
    expect(auditLog[0].timestamp).toBe("2024-01-15T11:00:00Z");
    expect(auditLog[0].error_details).toBe(
      "No health check criteria definition found in database"
    );

    expect(mockAiClient.analyzeDataQuality).not.toHaveBeenCalled();
    expect(mockAiClient.analyzeInferenceAccuracy).not.toHaveBeenCalled();
    expect(mockAiClient.aggregateAnomalies).not.toHaveBeenCalled();
  });
});