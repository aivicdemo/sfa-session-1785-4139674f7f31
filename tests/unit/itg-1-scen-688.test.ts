import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { getInferenceLogsByAgentId } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-688
  test("AIエージェントIDが null のとき推論ログの特定に失敗しエラーになる", async () => {
    const agent_id = null;

    expect(() => getInferenceLogsByAgentId(agent_id)).toThrow(
      /AGENT_ID_NOT_PROVIDED|INVALID_AGENT_ID/
    );
  });
});