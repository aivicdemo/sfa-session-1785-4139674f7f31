import { generateSystemHealthCheckReport } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-225
  test("システムヘルスチェック判定機能 - チェック対象システムが複数件のとき全件の結果がレポートとして出力される", async () => {
    const fetchMock = require("jest-fetch-mock");
    fetchMock.enableMocks();
    fetchMock.resetMocks();

    const systemA = {
      system_id: "system-a",
      system_name: "システムA",
      endpoint: "http://example.com/health-a",
    };

    const systemB = {
      system_id: "system-b",
      system_name: "システムB",
      endpoint: "http://example.com/health-b",
    };

    const systemC = {
      system_id: "system-c",
      system_name: "システムC",
      endpoint: "http://example.com/health-c",
    };

    const systemList = [systemA, systemB, systemC];

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "healthy",
        timestamp: "2024-01-15T11:00:00Z",
      }),
      { status: 200 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "unhealthy",
        timestamp: "2024-01-15T11:00:00Z",
      }),
      { status: 503 }
    );

    fetchMock.mockResponseOnce(
      JSON.stringify({
        status: "healthy",
        timestamp: "2024-01-15T11:00:00Z",
      }),
      { status: 200 }
    );

    const report = await generateSystemHealthCheckReport(systemList);

    expect(report).toBeDefined();
    expect(report.total_system_count).toBe(3);
    expect(report.check_results).toHaveLength(3);

    const resultA = report.check_results.find(
      (r: { system_id: string }) => r.system_id === "system-a"
    );
    expect(resultA).toBeDefined();
    expect(resultA.system_name).toBe("システムA");
    expect(resultA.judgment).toBe("正常");
    expect(resultA.status_code).toBe(200);

    const resultB = report.check_results.find(
      (r: { system_id: string }) => r.system_id === "system-b"
    );
    expect(resultB).toBeDefined();
    expect(resultB.system_name).toBe("システムB");
    expect(resultB.judgment).toBe("障害検知");
    expect(resultB.status_code).toBe(503);

    const resultC = report.check_results.find(
      (r: { system_id: string }) => r.system_id === "system-c"
    );
    expect(resultC).toBeDefined();
    expect(resultC.system_name).toBe("システムC");
    expect(resultC.judgment).toBe("正常");
    expect(resultC.status_code).toBe(200);

    fetchMock.disableMocks();
  });
});