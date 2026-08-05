import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  monitorAiInferenceAccuracy,
  InferenceLogEntry,
  AccuracyMonitoringResult,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-517
  test("年度をまたぐ推論ログが正しく精度監視の対象に含まれる", () => {
    const startDate = new Date("2024-12-01T00:00:00Z");
    const endDate = new Date("2025-01-31T23:59:59Z");

    const inferenceLogsDecember: InferenceLogEntry[] = [
      {
        logId: "log-2024-12-15-001",
        timestamp: new Date("2024-12-15T10:30:00Z"),
        accuracyScore: 0.92,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.95,
        outputConfidenceLevel: 0.88,
        processingTimeMs: 245,
        agentId: "agent-sales-001",
      },
      {
        logId: "log-2024-12-15-002",
        timestamp: new Date("2024-12-15T11:15:00Z"),
        accuracyScore: 0.88,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.92,
        outputConfidenceLevel: 0.85,
        processingTimeMs: 312,
        agentId: "agent-sales-002",
      },
      {
        logId: "log-2024-12-15-003",
        timestamp: new Date("2024-12-15T12:00:00Z"),
        accuracyScore: 0.95,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.97,
        outputConfidenceLevel: 0.92,
        processingTimeMs: 198,
        agentId: "agent-sales-001",
      },
      {
        logId: "log-2024-12-15-004",
        timestamp: new Date("2024-12-15T13:45:00Z"),
        accuracyScore: 0.85,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.88,
        outputConfidenceLevel: 0.80,
        processingTimeMs: 267,
        agentId: "agent-sales-003",
      },
      {
        logId: "log-2024-12-15-005",
        timestamp: new Date("2024-12-15T14:30:00Z"),
        accuracyScore: 0.9,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.93,
        outputConfidenceLevel: 0.87,
        processingTimeMs: 289,
        agentId: "agent-sales-002",
      },
    ];

    const inferenceLogsJanuary: InferenceLogEntry[] = [
      {
        logId: "log-2025-01-10-001",
        timestamp: new Date("2025-01-10T09:00:00Z"),
        accuracyScore: 0.87,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.91,
        outputConfidenceLevel: 0.84,
        processingTimeMs: 223,
        agentId: "agent-sales-001",
      },
      {
        logId: "log-2025-01-10-002",
        timestamp: new Date("2025-01-10T10:30:00Z"),
        accuracyScore: 0.91,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.94,
        outputConfidenceLevel: 0.89,
        processingTimeMs: 256,
        agentId: "agent-sales-004",
      },
      {
        logId: "log-2025-01-10-003",
        timestamp: new Date("2025-01-10T11:45:00Z"),
        accuracyScore: 0.89,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.90,
        outputConfidenceLevel: 0.86,
        processingTimeMs: 234,
        agentId: "agent-sales-002",
      },
      {
        logId: "log-2025-01-10-004",
        timestamp: new Date("2025-01-10T13:20:00Z"),
        accuracyScore: 0.86,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.89,
        outputConfidenceLevel: 0.82,
        processingTimeMs: 278,
        agentId: "agent-sales-003",
      },
      {
        logId: "log-2025-01-10-005",
        timestamp: new Date("2025-01-10T14:50:00Z"),
        accuracyScore: 0.93,
        inferenceModelVersion: "v1.2.0",
        inputDataQuality: 0.96,
        outputConfidenceLevel: 0.91,
        processingTimeMs: 201,
        agentId: "agent-sales-001",
      },
    ];

    const allInferenceLogs = [
      ...inferenceLogsDecember,
      ...inferenceLogsJanuary,
    ];

    const monitoringParams = {
      startDate,
      endDate,
      accuracyThreshold: 0.85,
      confidenceLevelThreshold: 0.80,
    };

    const result: AccuracyMonitoringResult = monitorAiInferenceAccuracy(
      allInferenceLogs,
      monitoringParams
    );

    expect(result.totalLogsProcessed).toBe(10);

    expect(result.minAccuracyScore).toBe(0.85);
    expect(result.maxAccuracyScore).toBe(0.95);
    expect(result.avgAccuracyScore).toBe(0.896);

    expect(result.logsWithinMonitoringPeriod).toBe(10);

    expect(result.decemberLogsCount).toBe(5);
    expect(result.januaryLogsCount).toBe(5);

    expect(result.crossYearBoundaryProcessed).toBe(true);

    expect(result.traceInfo).toBeDefined();
    expect(
      result.traceInfo.includes("2024-12") ||
        result.traceInfo.includes("December")
    ).toBe(true);
    expect(
      result.traceInfo.includes("2025-01") ||
        result.traceInfo.includes("January")
    ).toBe(true);

    const accuracyScores = allInferenceLogs.map((log) => log.accuracyScore);
    const expectedAvg =
      accuracyScores.reduce((sum, score) => sum + score, 0) / 10;
    expect(result.avgAccuracyScore).toBeCloseTo(expectedAvg, 3);
  });
});