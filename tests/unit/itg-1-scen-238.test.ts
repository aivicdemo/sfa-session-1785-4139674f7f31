import { executeSystemHealthCheck } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-238
  test("システムヘルスチェック判定機能 - 全項目が不正常なとき複合結果がレポートに出力される", () => {
    const timestamp = new Date("2024-01-15T11:00:00Z");

    const healthCheckInput = {
      database_connection_status: "NG",
      external_api_status: "NG",
      cache_server_status: "NG",
      disk_free_space_status: "NG",
      execution_timestamp: timestamp,
    };

    const result = executeSystemHealthCheck(healthCheckInput);

    expect(result.overall_status).toBe("不正常");
    expect(result.database_connection).toBe("NG");
    expect(result.external_api_connection).toBe("NG");
    expect(result.cache_server_connection).toBe("NG");
    expect(result.disk_free_space).toBe("NG");
    expect(result.judgment_timestamp).toEqual(timestamp);
    expect(result.recommended_action).toBe(
      "すべてのヘルスチェック項目が不正常です。システム管理者に報告してください"
    );
  });
});