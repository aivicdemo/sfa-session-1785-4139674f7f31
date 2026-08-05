import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/agents/tx-3-imp-1/orchestrator";

interface HealthCheckDiagnosticResult {
  status: string;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  dbConnectionPoolUtilization: number;
  apiResponseTimeMs: number;
  errorRatePercent: number;
}

interface AuditEvent {
  actionId: string;
  executionTimestamp: string;
  executionStatus: string;
  checkItemCount: number;
  metricsData: {
    cpuUsage: number;
    memoryUsage: number;
    dbConnectionPoolUtilization: number;
    apiResponseTimeMs: number;
    errorRatePercent: number;
  };
}

interface ContextData {
  healthCheckResult: HealthCheckDiagnosticResult;
  auditEvents: AuditEvent[];
}

interface Tx3Imp1AiClientResponse {
  diagnosticResult: HealthCheckDiagnosticResult;
  success: boolean;
}

class FakeTx3Imp1AiClient {
  private mockResponse: Tx3Imp1AiClientResponse;
  private callHistory: Array<{
    actionType: string;
    timestamp: string;
  }> = [];

  constructor() {
    this.mockResponse = {
      diagnosticResult: {
        status: "healthy",
        timestamp: "2024-01-15T10:30:00Z",
        cpuUsage: 45,
        memoryUsage: 62,
        dbConnectionPoolUtilization: 38,
        apiResponseTimeMs: 250,
        errorRatePercent: 0.2,
      },
      success: true,
    };
  }

  async executeSystemHealthCheckDiagnostic(): Promise<HealthCheckDiagnosticResult> {
    this.callHistory.push({
      actionType: "executeSystemHealthCheckDiagnostic",
      timestamp: new Date().toISOString(),
    });
    return this.mockResponse.diagnosticResult;
  }

  getCallHistory(): Array<{ actionType: string; timestamp: string }> {
    return this.callHistory;
  }

  reset(): void {
    this.callHistory = [];
  }
}

describe("Tx3Imp1Agent - Health Check Diagnostic Autonomous Execution", () => {
  let fakeTx3Imp1AiClient: FakeTx3Imp1AiClient;
  let executionStartTime: string;
  let executionEndTime: string;
  let contextData: ContextData | null = null;

  beforeEach(() => {
    fakeTx3Imp1AiClient = new FakeTx3Imp1AiClient();
    executionStartTime = "2024-01-15T10:00:00Z";
    executionEndTime = "";
    contextData = null;
  });

  afterEach(() => {
    fakeTx3Imp1AiClient.reset();
    contextData = null;
  });

  // SCEN-1258
  test(
    "should execute system health check diagnostic action and record audit event with correct metrics",
    async () => {
      const triggerType = "scheduled";
      const executionContextTimestamp = "2024-01-15T10:00:00Z";
      const expectedHealthCheckStatus = "healthy";
      const expectedCpuUsage = 45;
      const expectedMemoryUsage = 62;
      const expectedDbConnectionPoolUtilization = 38;
      const expectedApiResponseTimeMs = 250;
      const expectedErrorRatePercent = 0.2;
      const expectedCheckItemCount = 5;
      const expectedExecutionStatus = "success";

      const diagnosticResult =
        await fakeTx3Imp1AiClient.executeSystemHealthCheckDiagnostic();

      expect(diagnosticResult.status).toBe(expectedHealthCheckStatus);
      expect(diagnosticResult.cpuUsage).toBe(expectedCpuUsage);
      expect(diagnosticResult.memoryUsage).toBe(expectedMemoryUsage);
      expect(diagnosticResult.dbConnectionPoolUtilization).toBe(
        expectedDbConnectionPoolUtilization
      );
      expect(diagnosticResult.apiResponseTimeMs).toBe(expectedApiResponseTimeMs);
      expect(diagnosticResult.errorRatePercent).toBe(expectedErrorRatePercent);

      const callHistory = fakeTx3Imp1AiClient.getCallHistory();
      expect(callHistory).toHaveLength(1);
      expect(callHistory[0].actionType).toBe("executeSystemHealthCheckDiagnostic");

      const auditEvent: AuditEvent = {
        actionId: "action-health-check-diagnostic-001",
        executionTimestamp: diagnosticResult.timestamp,
        executionStatus: expectedExecutionStatus,
        checkItemCount: expectedCheckItemCount,
        metricsData: {
          cpuUsage: diagnosticResult.cpuUsage,
          memoryUsage: diagnosticResult.memoryUsage,
          dbConnectionPoolUtilization:
            diagnosticResult.dbConnectionPoolUtilization,
          apiResponseTimeMs: diagnosticResult.apiResponseTimeMs,
          errorRatePercent: diagnosticResult.errorRatePercent,
        },
      };

      expect(auditEvent.actionId).toBe("action-health-check-diagnostic-001");
      expect(auditEvent.executionTimestamp).toBe("2024-01-15T10:30:00Z");
      expect(auditEvent.executionStatus).toBe(expectedExecutionStatus);
      expect(auditEvent.checkItemCount).toBe(expectedCheckItemCount);
      expect(auditEvent.metricsData.cpuUsage).toBe(expectedCpuUsage);
      expect(auditEvent.metricsData.memoryUsage).toBe(expectedMemoryUsage);
      expect(auditEvent.metricsData.dbConnectionPoolUtilization).toBe(
        expectedDbConnectionPoolUtilization
      );
      expect(auditEvent.metricsData.apiResponseTimeMs).toBe(
        expectedApiResponseTimeMs
      );
      expect(auditEvent.metricsData.errorRatePercent).toBe(
        expectedErrorRatePercent
      );

      contextData = {
        healthCheckResult: diagnosticResult,
        auditEvents: [auditEvent],
      };

      expect(contextData.healthCheckResult).toBeDefined();
      expect(contextData.auditEvents).toHaveLength(1);
      expect(contextData.auditEvents[0].metricsData).toEqual(
        auditEvent.metricsData
      );

      const idempotenRetryStartTime = "2024-01-15T10:35:00Z";
      const retryDiagnosticResult =
        await fakeTx3Imp1AiClient.executeSystemHealthCheckDiagnostic();

      expect(retryDiagnosticResult.status).toBe(expectedHealthCheckStatus);
      expect(retryDiagnosticResult.cpuUsage).toBe(expectedCpuUsage);
      expect(retryDiagnosticResult.memoryUsage).toBe(expectedMemoryUsage);
      expect(retryDiagnosticResult.dbConnectionPoolUtilization).toBe(
        expectedDbConnectionPoolUtilization
      );
      expect(retryDiagnosticResult.apiResponseTimeMs).toBe(
        expectedApiResponseTimeMs
      );
      expect(retryDiagnosticResult.errorRatePercent).toBe(
        expectedErrorRatePercent
      );

      const retryCallHistory = fakeTx3Imp1AiClient.getCallHistory();
      expect(retryCallHistory).toHaveLength(2);
      expect(retryCallHistory[1].actionType).toBe(
        "executeSystemHealthCheckDiagnostic"
      );
    }
  );
});