import { monitorAIInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-435
  test("複数の推論精度が同時に低下している場合、全てのアラートが適切に発生する", () => {
    const engineConfigs = [
      {
        engineId: "customer_classification",
        engineName: "顧客分類エンジン",
        currentAccuracy: 65,
        threshold: 70,
        recommendedAction: "モデル再学習",
      },
      {
        engineId: "sales_forecast",
        engineName: "売上予測エンジン",
        currentAccuracy: 58,
        threshold: 70,
        recommendedAction: "データ品質確認",
      },
      {
        engineId: "proposal_optimization",
        engineName: "提案最適化エンジン",
        currentAccuracy: 62,
        threshold: 70,
        recommendedAction: "ハイパーパラメータ調整",
      },
    ];

    const result = monitorAIInferenceAccuracy(engineConfigs);

    expect(result.alerts).toHaveLength(3);
    expect(result.alerts[0]).toEqual({
      engineId: "customer_classification",
      engineName: "顧客分類エンジン",
      accuracy: 65,
      threshold: 70,
      status: "alert",
      recommendedAction: "モデル再学習",
      timestamp: expect.any(String),
    });
    expect(result.alerts[1]).toEqual({
      engineId: "sales_forecast",
      engineName: "売上予測エンジン",
      accuracy: 58,
      threshold: 70,
      status: "alert",
      recommendedAction: "データ品質確認",
      timestamp: expect.any(String),
    });
    expect(result.alerts[2]).toEqual({
      engineId: "proposal_optimization",
      engineName: "提案最適化エンジン",
      accuracy: 62,
      threshold: 70,
      status: "alert",
      recommendedAction: "ハイパーパラメータ調整",
      timestamp: expect.any(String),
    });

    const timestamps = result.alerts.map((alert) => alert.timestamp);
    const uniqueSeconds = new Set(
      timestamps.map((ts) => ts.substring(0, 19))
    );
    expect(uniqueSeconds.size).toBe(1);
  });
});