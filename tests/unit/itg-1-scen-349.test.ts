import { monitorAiAgentInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-349: 監視対象のAIエージェントが特定できないとき、エラーが発生する", async () => {
    fetchMock.resetMocks();

    const nonExistentAgentId = "agent_nonexistent_12345";
    const expectedErrorCode = "AGENT_NOT_FOUND";
    const expectedHttpStatus = 404;
    const expectedErrorMessage = `監視対象のAIエージェント（ID:${nonExistentAgentId}）が見つかりません`;

    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: "Agent not found",
        agentId: nonExistentAgentId,
      }),
      { status: 404 }
    );

    const result = await monitorAiAgentInferencePrecision({
      agentId: nonExistentAgentId,
      monitoringPeriodStartDate: "2024-01-01T00:00:00Z",
      monitoringPeriodEndDate: "2024-01-31T23:59:59Z",
    });

    expect(result).toBeDefined();
    expect(result.isError).toBe(true);
    expect(result.error).toBeDefined();
    expect(result.error.code).toBe(expectedErrorCode);
    expect(result.error.httpStatus).toBe(expectedHttpStatus);
    expect(result.error.message).toBe(expectedErrorMessage);
    expect(result.systemStopped).toBe(false);
  });
});