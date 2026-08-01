import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-509
  test("精度スコア算出対象期間の開始日と終了日が同日の場合、正しく計算される", async () => {
    const startDate = new Date("2024-01-15T00:00:00Z");
    const endDate = new Date("2024-01-15T23:59:59Z");

    const inferenceResults = [
      {
        inferenceId: "INF-001",
        accuracy: 85,
        timestamp: new Date("2024-01-15T08:00:00Z"),
      },
      {
        inferenceId: "INF-002",
        accuracy: 90,
        timestamp: new Date("2024-01-15T12:30:00Z"),
      },
      {
        inferenceId: "INF-003",
        accuracy: 95,
        timestamp: new Date("2024-01-15T18:45:00Z"),
      },
    ];

    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: inferenceResults,
        count: 3,
      }),
      { status: 200 }
    );

    const result = await calculateInferenceAccuracyScore({
      startDate,
      endDate,
    });

    expect(result.accuracyScore).toBe(90.0);
    expect(result.dataCount).toBe(3);
    expect(result.isSuccessful).toBe(true);
  });
});