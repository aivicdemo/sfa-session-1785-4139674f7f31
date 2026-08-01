import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { analyzeAndJudgeImprovement } from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-214: [normal] 営業担当者行動パターン分析・改善指導対象判定機能 - AIエージェント推論精度が閾値以下に低下した場合、アラートが自動生成される
  test("推論精度が閾値70%以下に低下した場合、AIエージェント推論精度低下アラートが自動生成される", async () => {
    const salesRepId = "SR-001";
    const inferenceAccuracy = 60;
    const thresholdAccuracy = 70;
    const currentTimestamp = new Date("2024-01-15T11:00:00Z");

    // AIエージェント推論精度監視モジュールをモック化
    fetchMock.mockResponseOnce(
      JSON.stringify({
        salesRepId: salesRepId,
        inferenceAccuracy: inferenceAccuracy,
        thresholdAccuracy: thresholdAccuracy,
        timestamp: currentTimestamp.toISOString(),
      }),
      { status: 200 }
    );

    // アラート生成システムのモック
    fetchMock.mockResponseOnce(
      JSON.stringify({
        alertId: "ALERT-001",
        alertType: "AIエージェント推論精度低下",
        severity: "HIGH",
        detectedAccuracy: 60,
        thresholdAccuracy: 70,
        timestamp: currentTimestamp.toISOString(),
        targetSalesRepId: salesRepId,
      }),
      { status: 201 }
    );

    const result = await analyzeAndJudgeImprovement({
      salesRepId: salesRepId,
      inferenceAccuracy: inferenceAccuracy,
      thresholdAccuracy: thresholdAccuracy,
      timestamp: currentTimestamp,
    });

    expect(result.alertGenerated).toBe(true);
    expect(result.alert.alertType).toBe("AIエージェント推論精度低下");
    expect(result.alert.severity).toBe("HIGH");
    expect(result.alert.detectedAccuracy).toBe(60);
    expect(result.alert.thresholdAccuracy).toBe(70);
    expect(result.alert.targetSalesRepId).toBe("SR-001");

    const alertTimestamp = new Date(result.alert.timestamp);
    const timeDiff = Math.abs(
      alertTimestamp.getTime() - currentTimestamp.getTime()
    );
    expect(timeDiff).toBeLessThanOrEqual(1000);
  });
});