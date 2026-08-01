import { executeHealthCheckDiagnosis } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-242
  test("複数のAIエージェント推論精度評価があるとき全件がレポートに含まれる", () => {
    const aiAgentPrecisionEvaluations = [
      {
        agentId: "agent_001",
        agentName: "エージェントA",
        precisionScore: 85,
        evaluationTimestamp: new Date("2024-01-15T10:00:00Z"),
      },
      {
        agentId: "agent_002",
        agentName: "エージェントB",
        precisionScore: 92,
        evaluationTimestamp: new Date("2024-01-15T10:05:00Z"),
      },
      {
        agentId: "agent_003",
        agentName: "エージェントC",
        precisionScore: 78,
        evaluationTimestamp: new Date("2024-01-15T10:10:00Z"),
      },
    ];

    const report = executeHealthCheckDiagnosis({
      checkTargetSystems: ["営業プロセス監査・分析管理システム"],
      dataQualityMetrics: {
        totalRecords: 1500,
        validRecords: 1425,
        qualityScore: 95,
      },
      aiAgentInferenceEvaluations: aiAgentPrecisionEvaluations,
      checkExecutionTimestamp: new Date("2024-01-15T11:00:00Z"),
    });

    expect(report).toBeDefined();
    expect(report.aiAgentInferencePrecisionSection).toBeDefined();
    expect(report.aiAgentInferencePrecisionSection.evaluationCount).toBe(3);
    expect(report.aiAgentInferencePrecisionSection.evaluations).toHaveLength(3);

    const evaluations = report.aiAgentInferencePrecisionSection.evaluations;

    expect(evaluations[0].agentId).toBe("agent_001");
    expect(evaluations[0].agentName).toBe("エージェントA");
    expect(evaluations[0].precisionScore).toBe(85);

    expect(evaluations[1].agentId).toBe("agent_002");
    expect(evaluations[1].agentName).toBe("エージェントB");
    expect(evaluations[1].precisionScore).toBe(92);

    expect(evaluations[2].agentId).toBe("agent_003");
    expect(evaluations[2].agentName).toBe("エージェントC");
    expect(evaluations[2].precisionScore).toBe(78);
  });
});