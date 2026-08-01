import { generateHealthCheckReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-249
  test('レポート出力時の日時情報が正確に記録される', () => {
    const mockTimestamp = '2024-01-15T14:30:45.123Z';
    const mockNow = new Date(mockTimestamp);

    jest.useFakeTimers();
    jest.setSystemTime(mockNow);

    const report = generateHealthCheckReport({
      systemUptime: 99.5,
      dataQualityScore: 95.2,
      inferenceAccuracy: 94.8,
    });

    jest.useRealTimers();

    expect(report.timestamp).toBe(mockTimestamp);
    expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});