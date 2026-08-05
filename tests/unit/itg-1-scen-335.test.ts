import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { runTx3Imp1Agent } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  let systemLogEvents: Array<{
    level: string;
    message: string;
    timestamp: string;
  }> = [];

  beforeEach(() => {
    systemLogEvents = [];
    jest.clearAllMocks();
  });

  afterEach(() => {
    systemLogEvents = [];
  });

  // SCEN-335
  test("AIエージェント推論精度監視データベースへの接続が失敗したとき、エラーが発生する", async () => {
    const testTimestamp = new Date("2024-01-15T11:00:00Z");

    const mockHealthCheckService = {
      execute: jest.fn().mockResolvedValue({
        success: true,
        systemStatus: "HEALTHY",
        timestamp: testTimestamp.toISOString(),
      }),
    };

    const mockDataQualityService = {
      analyze: jest.fn().mockResolvedValue({
        success: true,
        qualityScore: 94.5,
        issues: [],
        timestamp: testTimestamp.toISOString(),
      }),
    };

    const mockInferencePrecisionService = {
      evaluate: jest.fn().mockRejectedValue(
        new Error("CONNECTION_TIMEOUT: Failed to connect to database")
      ),
    };

    const mockSystemLogger = {
      log: jest.fn((level: string, message: string) => {
        systemLogEvents.push({
          level,
          message,
          timestamp: new Date().toISOString(),
        });
      }),
    };

    let thrownError: Error | null = null;

    try {
      await runTx3Imp1Agent({
        triggerSource: "scheduled_monitoring",
        checkType: "integrated_diagnosis",
        healthCheckService: mockHealthCheckService,
        dataQualityService: mockDataQualityService,
        inferencePrecisionService: mockInferencePrecisionService,
        systemLogger: mockSystemLogger,
      });
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).not.toBeNull();
    expect(thrownError).toBeInstanceOf(Error);
    expect(thrownError?.message).toMatch(/AIエージェント推論精度監視/);
    expect(thrownError?.message).toMatch(/接続に失敗/);

    const dbConnectionError = thrownError as any;
    expect(dbConnectionError?.code).toBe("DB_CONNECTION_FAILED");

    const errorLogEntry = systemLogEvents.find(
      (event) =>
        event.level === "ERROR" &&
        event.message.includes("Tx3Imp1Agent") &&
        event.message.includes("inference precision monitoring database")
    );
    expect(errorLogEntry).toBeDefined();
    expect(errorLogEntry?.message).toMatch(/\d{4}-\d{2}-\d{2}T/);

    expect(mockInferencePrecisionService.evaluate).toHaveBeenCalled();
    expect(mockHealthCheckService.execute).toHaveBeenCalled();
    expect(mockDataQualityService.analyze).toHaveBeenCalled();
  });
});