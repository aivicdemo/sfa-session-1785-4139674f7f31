import { runTx3Imp1Agent, Tx3Imp1AiClient } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-1264
  test("ヘルスチェック・データ品質・推論精度の統合診断と異常集約の自律実行 AIエージェント - システムダウン検出時に人へ引き継ぎ", async () => {
    const mockAiClient: Tx3Imp1AiClient = {
      executeHealthCheck: jest.fn().mockResolvedValue({
        status: "SYSTEM_DOWN",
        timestamp: "2024-01-15T14:30:00Z",
        systemId: "sales-audit-system-01",
        failedComponentsCount: 3,
        criticalityLevel: "CRITICAL",
      }),
      executeDataQualityAnalysis: jest.fn().mockResolvedValue({
        overallScore: 92,
        timestamp: "2024-01-15T14:30:05Z",
        issuesDetected: 2,
        qualityStatus: "ACCEPTABLE",
      }),
      executeInferenceAccuracyEvaluation: jest.fn().mockResolvedValue({
        accuracyScore: 94.5,
        timestamp: "2024-01-15T14:30:10Z",
        modelId: "ai-model-v3",
        performanceStatus: "NORMAL",
      }),
      aggregateAnomalies: jest.fn(),
      determinePriority: jest.fn(),
      generateReport: jest.fn(),
      escalateToHuman: jest.fn().mockResolvedValue({
        escalationId: "ESC-20240115-001",
        escalatedAt: "2024-01-15T14:30:00Z",
        humanHandoffStatus: "PENDING_REVIEW",
      }),
      transitionToWaitingState: jest.fn().mockResolvedValue({
        agentState: "WAITING_FOR_HUMAN_DECISION",
        timestamp: "2024-01-15T14:30:01Z",
      }),
      recordAuditEvent: jest.fn().mockResolvedValue({
        eventId: "EVT-20240115-001",
        eventType: "ESCALATION_CONDITION_MATCHED",
        description: "Escalation condition matched: System down detected → Human handoff executed",
        recordedAt: "2024-01-15T14:30:00Z",
      }),
    };

    const diagnosticRunId = "diag-run-20240115-001";
    const triggeredBy = "HEALTH_CHECK_ALERT";

    const result = await runTx3Imp1Agent(
      {
        runId: diagnosticRunId,
        triggeredBy: triggeredBy,
        diagnosticScope: ["HEALTH_CHECK", "DATA_QUALITY", "INFERENCE_ACCURACY"],
        scheduledTime: "2024-01-15T14:30:00Z",
      },
      mockAiClient
    );

    // (1) ヘルスチェックが実行される
    expect(mockAiClient.executeHealthCheck).toHaveBeenCalledTimes(1);

    // (2) システムダウン検出により、異常集約と優先度判定は実行されていない
    expect(mockAiClient.aggregateAnomalies).not.toHaveBeenCalled();
    expect(mockAiClient.determinePriority).not.toHaveBeenCalled();

    // (3) 人へのエスカレーションが実行されている
    expect(mockAiClient.escalateToHuman).toHaveBeenCalledTimes(1);
    expect(mockAiClient.escalateToHuman).toHaveBeenCalledWith(
      expect.objectContaining({
        anomalyType: "SYSTEM_DOWN",
        detectionTimestamp: "2024-01-15T14:30:00Z",
        diagnosticSnapshot: expect.any(Object),
      })
    );

    // (4) AIエージェントが待機状態に遷移している
    expect(mockAiClient.transitionToWaitingState).toHaveBeenCalledTimes(1);
    expect(mockAiClient.transitionToWaitingState).toHaveBeenCalledWith({
      reason: "HUMAN_HANDOFF_ACTIVE",
      escalationId: "ESC-20240115-001",
    });

    // (5) 監査ログにエスカレーション条件マッチイベントが記録されている
    expect(mockAiClient.recordAuditEvent).toHaveBeenCalledTimes(1);
    expect(mockAiClient.recordAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "ESCALATION_CONDITION_MATCHED",
        description: expect.stringContaining("System down detected"),
        escalationCondition: "SYSTEM_DOWN",
        humanHandoffExecuted: true,
      })
    );

    // (6) 返却される結果が人への引き継ぎフロー完結を示唆する状態
    expect(result).toEqual(
      expect.objectContaining({
        runId: diagnosticRunId,
        status: "ESCALATED_TO_HUMAN",
        escalationId: "ESC-20240115-001",
        humanHandoffStatus: "PENDING_REVIEW",
        agentState: "WAITING_FOR_HUMAN_DECISION",
        diagnosticResults: expect.objectContaining({
          healthCheckStatus: "SYSTEM_DOWN",
          dataQualityStatus: "ACCEPTABLE",
          inferenceAccuracyStatus: "NORMAL",
        }),
        anomalyAggregation: null,
        priorityDetermination: null,
        autoRemediationExecuted: false,
        reportGenerated: false,
        auditLog: expect.arrayContaining([
          expect.objectContaining({
            eventType: "ESCALATION_CONDITION_MATCHED",
          }),
        ]),
      })
    );

    // (7) レポート生成と自動修復は実行されていない（副作用確定前に引き継ぎが実行された）
    expect(mockAiClient.generateReport).not.toHaveBeenCalled();
  });
});