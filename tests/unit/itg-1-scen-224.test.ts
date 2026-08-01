import { generateHealthCheckReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-224: [normal] システムヘルスチェック判定機能 - チェック対象システムが1件のとき結果がレポートとして出力される
  test('should generate health check report in JSON format with single system metrics', () => {
    const now = new Date('2024-01-15T11:00:00Z');
    const reportTimestamp = new Date('2024-01-15T11:00:05Z');

    const systemCheckData = {
      systemId: 'system-001',
      systemName: 'sales_audit_system',
      checkTimestamp: now,
      operationalStatus: 'healthy',
      cpuUsagePercent: 45.2,
      memoryUsagePercent: 62.8,
      responseTimeMs: 125,
      errorLogCount: 2,
    };

    const result = generateHealthCheckReport([systemCheckData], reportTimestamp);

    expect(result).toBeDefined();
    expect(result.format).toBe('json');
    expect(result.fileContent).toBeDefined();
    expect(result.fileContent.length).toBeGreaterThan(0);

    const parsedContent = JSON.parse(result.fileContent);

    expect(parsedContent.systemsChecked).toBe(1);
    expect(Array.isArray(parsedContent.systems)).toBe(true);
    expect(parsedContent.systems.length).toBe(1);

    const system = parsedContent.systems[0];
    expect(system.systemId).toBe('system-001');
    expect(system.systemName).toBe('sales_audit_system');
    expect(system.operationalStatus).toBe('healthy');
    expect(system.cpuUsagePercent).toBe(45.2);
    expect(system.memoryUsagePercent).toBe(62.8);
    expect(system.responseTimeMs).toBe(125);
    expect(system.errorLogCount).toBe(2);

    expect(result.generatedAt).toBeDefined();
    const timeDiff = Math.abs(
      new Date(result.generatedAt).getTime() - reportTimestamp.getTime()
    );
    expect(timeDiff).toBeLessThanOrEqual(60000);

    expect(result.fileName).toMatch(/health_check_report_\d+\.json/);
  });
});