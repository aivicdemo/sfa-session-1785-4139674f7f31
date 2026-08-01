import { executeInference } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-104: 品質検証ルール未定義時に推論実行が保留される", () => {
    const trainingDataset = {
      datasetId: "dataset-001",
      recordCount: 1000,
      completenessScore: 95,
    };

    const result = executeInference({
      dataset: trainingDataset,
      qualityRuleCount: 0,
    });

    expect(result.statusCode).toBe(40301);
    expect(result.statusLabel).toBe("PENDING_RULE_DEFINITION");
    expect(result.taskStatus).toBe("SUSPENDED");
    expect(result.inferenceResultCreated).toBe(false);
    expect(result.systemLogMessage).toMatch(/品質検証ルールが未定義のため推論を保留中/);
    expect(result.systemLogMessage).toMatch(/タスクID=/);
    expect(result.systemLogMessage).toMatch(/データセットID=/);
  });
});