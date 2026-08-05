import { runHealthCheckDiagnosis } from '../../src/logic/it-1';

const fetchMock = require('jest-fetch-mock');

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-309: [normal] システムヘルスチェック判定機能 - チェック対象が1件の場合にレポート結果が出力される', async () => {
    fetchMock.resetMocks();

    const checkTargetId = 'server-001';
    const checkTargetName = '営業システムDB接続';
    const checkExecutionDateTime = new Date('2024-01-15T11:00:00Z');
    const expectedStatus = 'OK';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        targetId: checkTargetId,
        targetName: checkTargetName,
        executionDateTime: checkExecutionDateTime.toISOString(),
        status: expectedStatus,
        statusCode: 200,
        responseTime: 125,
        details: {
          cpuUsage: 45.2,
          memoryUsage: 62.8,
          diskUsage: 38.1,
          connectionPool: 'active',
          replicationLag: 0,
        },
      }),
      { status: 200 }
    );

    const result = await runHealthCheckDiagnosis({
      checkTargets: [
        {
          id: checkTargetId,
          name: checkTargetName,
          type: 'database',
          endpoint: 'https://api.internal.example.com/health/db',
        },
      ],
      executionDateTime: checkExecutionDateTime,
    });

    expect(result).toBeDefined();
    expect(result.reportId).toBeDefined();
    expect(result.executionDateTime).toBe(checkExecutionDateTime.toISOString());
    expect(result.totalTargetsChecked).toBe(1);
    expect(result.passedCount).toBe(1);
    expect(result.failedCount).toBe(0);
    expect(result.overallStatus).toBe('PASS');
    expect(result.details).toBeDefined();
    expect(result.details.length).toBe(1);

    const targetResult = result.details[0];
    expect(targetResult.targetId).toBe(checkTargetId);
    expect(targetResult.targetName).toBe(checkTargetName);
    expect(targetResult.checkStatus).toBe(expectedStatus);
    expect(targetResult.executionDateTime).toBe(checkExecutionDateTime.toISOString());
    expect(targetResult.statusDetails).toBeDefined();
    expect(targetResult.statusDetails.cpuUsage).toBe(45.2);
    expect(targetResult.statusDetails.memoryUsage).toBe(62.8);
    expect(targetResult.statusDetails.diskUsage).toBe(38.1);
    expect(targetResult.statusDetails.connectionPool).toBe('active');
    expect(targetResult.statusDetails.replicationLag).toBe(0);
  });
});