import { runTx3Imp1Agent } from "../../src/logic/it-1";
import type { Tx3Imp1AiClient } from "../../src/agents/tx-3-imp-1/orchestrator";

// Mock file system module
jest.mock("fs", () => ({
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
  accessSync: jest.fn(),
}));

jest.mock("fs/promises", () => ({
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  access: jest.fn(),
}));

import * as fs from "fs";
import * as fsPromises from "fs/promises";

describe("営業プロセス実行状況の監査ダッシュボード - システムヘルスチェック実行機能", () => {
  // SCEN-339
  test("レポート出力先への書き込み権限がないとき、エラーが発生する", async () => {
    const mockAiClient: Tx3Imp1AiClient = {
      diagnoseSystemHealth: jest.fn().mockResolvedValue({
        status: "HEALTHY",
        uptime_seconds: 86400,
        error_rate: 0.001,
        response_time_ms: 250,
        timestamp: new Date("2024-01-15T11:00:00Z"),
      }),
      analyzeDataQuality: jest.fn().mockResolvedValue({
        quality_score: 96.5,
        completeness: 98.2,
        accuracy: 95.1,
        consistency: 96.3,
        issues_detected: 3,
        timestamp: new Date("2024-01-15T11:00:00Z"),
      }),
      evaluateInferenceAccuracy: jest.fn().mockResolvedValue({
        accuracy_score: 94.8,
        precision: 95.2,
        recall: 94.4,
        f1_score: 94.8,
        sample_count: 500,
        timestamp: new Date("2024-01-15T11:00:00Z"),
      }),
    };

    const reportOutputPath = "/reports/health-check";
    const permissionError = new Error("Permission denied (errno: EACCES)");
    (permissionError as any).code = "EACCES";
    (permissionError as any).errno = -13;

    (fsPromises.writeFile as jest.Mock).mockRejectedValueOnce(permissionError);

    const triggerEvent = {
      type: "SCHEDULED_CHECK" as const,
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    try {
      await runTx3Imp1Agent(
        {
          aiClient: mockAiClient,
          reportOutputPath: reportOutputPath,
          diagnosticThresholds: {
            system_health_failure_threshold: 0.95,
            data_quality_minimum_score: 90.0,
            inference_accuracy_minimum_score: 90.0,
          },
        },
        triggerEvent
      );

      fail("Expected an error to be thrown for permission denied");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.code).toBe("EACCES");
      expect(error.message).toMatch(/Permission denied/);
      expect(error.message).toMatch(/EACCES/);

      expect(mockAiClient.diagnoseSystemHealth).toHaveBeenCalled();
      expect(mockAiClient.analyzeDataQuality).toHaveBeenCalled();
      expect(mockAiClient.evaluateInferenceAccuracy).toHaveBeenCalled();

      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining(reportOutputPath),
        expect.any(String),
        expect.any(String)
      );
    }
  });
});