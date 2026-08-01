import { determineActionTiming } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-540
  test("問題の重要度が対応時期判定の基準値を超過する場合、対応時期が『当日対応（24時間以内）』と判定される", () => {
    const problemData = {
      problemId: "prob_001",
      severity: "緊急",
      severityThreshold: "高",
      detectedAt: new Date("2024-01-15T09:00:00Z"),
      description: "重大なプロセス遵守率低下を検出",
    };

    const result = determineActionTiming(problemData);

    expect(result).toEqual({
      actionTiming: "当日対応（24時間以内）",
      targetDateTime: new Date("2024-01-15T23:59:59Z"),
      severity: "緊急",
      priorityLevel: 1,
    });
  });
});