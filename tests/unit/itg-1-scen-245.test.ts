import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { performSystemHealthCheck } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-245
  test("システムヘルスチェック判定機能 - 営業データ品質スコアが合格基準を満たす場合に合格判定を返す", async () => {
    const mockHealthCheckData = {
      systemStatus: "operational",
      dataQualityScore: 85,
      aiInferenceAccuracy: 92,
      timestamp: "2024-01-15T11:00:00Z",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockHealthCheckData), {
      status: 200,
    });

    const result = await performSystemHealthCheck({
      targetSystem: "営業プロセス監査・分析管理システム",
      checkType: "data_quality",
      passingCriteria: 80,
    });

    expect(result.status).toBe("PASSED");
    expect(result.score).toBe(85);
    expect(result.message).toBe("営業データ品質が基準を満たしています");
    expect(result.statusCode).toBe(200);
  });
});