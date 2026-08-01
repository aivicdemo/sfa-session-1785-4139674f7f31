import { executeHealthCheckDiagnosis } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-223
  test("[normal] システムヘルスチェック判定機能 - チェック対象システムが0件のとき結果がレポートとして出力される", () => {
    const targetSystems: Array<{
      systemId: string;
      systemName: string;
      lastCheckAt: string;
    }> = [];

    const executionDateTime = "2024-06-15T09:30:00Z";

    const report = executeHealthCheckDiagnosis({
      targetSystems,
      executionDateTime,
    });

    expect(report).toEqual({
      targetSystemCount: 0,
      executionDateTime: "2024-06-15T09:30:00Z",
      diagnosticStatus: "対象システム件数: 0件",
      diagnosticMessage: "診断対象なし",
      healthCheckResults: [],
      dataQualityScore: null,
      aiInferenceAccuracyScore: null,
      reportStatus: "completed",
    });

    expect(report.targetSystemCount).toBe(0);
    expect(report.diagnosticStatus).toBe("対象システム件数: 0件");
    expect(report.diagnosticMessage).toBe("診断対象なし");
    expect(report.healthCheckResults.length).toBe(0);
  });
});