import { monitorAiAgentInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-488
  test("監視対象のAIエージェントIDが空文字列の場合、エラーを返す", () => {
    const empty_agent_id = "";
    const monitoring_threshold = 0.95;

    expect(() =>
      monitorAiAgentInferencePrecision({
        agent_id: empty_agent_id,
        precision_threshold: monitoring_threshold,
      })
    ).toThrow(/AIエージェントID/);
  });
});