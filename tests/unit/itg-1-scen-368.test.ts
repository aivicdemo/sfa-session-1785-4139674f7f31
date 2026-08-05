import { generateHealthCheckReport } from '../../src/logic/it-1-br-2-1-1';

describe('システムヘルスチェック結果レポート生成機能 - 月末データ対応', () => {
  // SCEN-368
  test('チェック対象期間が月末を含む場合に正常に判定される', () => {
    // Arrange: チェック対象期間を2024年1月1日〜2024年1月31日に設定
    const checkStartDate = new Date('2024-01-01T00:00:00Z');
    const checkEndDate = new Date('2024-01-31T23:59:59Z');

    // スタブデータ: CPU使用率、メモリ使用率、ディスク使用率、API応答時間
    const healthCheckData = [
      // 月初のデータ
      {
        timestamp: new Date('2024-01-01T12:00:00Z'),
        cpuUsagePercent: 45.0,
        memoryUsagePercent: 55.0,
        diskUsagePercent: 60.0,
        apiResponseTimeMs: 120,
      },
      // 月中のデータ
      {
        timestamp: new Date('2024-01-15T12:00:00Z'),
        cpuUsagePercent: 50.0,
        memoryUsagePercent: 58.0,
        diskUsagePercent: 62.0,
        apiResponseTimeMs: 130,
      },
      // 月末のデータ（重要: 月末日のデータを含める）
      {
        timestamp: new Date('2024-01-31T12:00:00Z'),
        cpuUsagePercent: 48.0,
        memoryUsagePercent: 56.0,
        diskUsagePercent: 61.0,
        apiResponseTimeMs: 125,
      },
      {
        timestamp: new Date('2024-01-31T23:00:00Z'),
        cpuUsagePercent: 42.0,
        memoryUsagePercent: 52.0,
        diskUsagePercent: 59.0,
        apiResponseTimeMs: 118,
      },
    ];

    // 合格基準を定義
    const passCriteria = {
      cpuUsagePercentMax: 80.0,
      memoryUsagePercentMax: 85.0,
      diskUsagePercentMax: 90.0,
      apiResponseTimeMaxMs: 500,
    };

    // Act: レポート生成処理を実行
    const report = generateHealthCheckReport({
      checkStartDate,
      checkEndDate,
      healthCheckData,
      passCriteria,
    });

    // Assert: 生成されたレポートの期間範囲を検証
    expect(report.periodStart).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(report.periodEnd).toEqual(new Date('2024-01-31T23:59:59Z'));

    // 生成されたレポートに含まれるデータポイント数を検証
    // 31日分で、各日に複数のデータポイントがある場合を想定
    expect(report.dataPointCount).toBe(4);

    // 月末日（1月31日）のデータが漏落なく含まれていることを確認
    const monthEndDataPoints = report.includedTimestamps.filter(
      (ts) => ts.getUTCDate() === 31
    );
    expect(monthEndDataPoints.length).toBe(2);
    expect(monthEndDataPoints[0]).toEqual(new Date('2024-01-31T12:00:00Z'));
    expect(monthEndDataPoints[1]).toEqual(new Date('2024-01-31T23:00:00Z'));

    // 月末日のチェック結果が正常に集計・反映されていることを確認
    expect(report.dataPointsInPeriod).toBe(4);
    expect(report.allChecksPassed).toBe(true);

    // CPU使用率の平均値が正常に計算されていることを確認
    // (45.0 + 50.0 + 48.0 + 42.0) / 4 = 46.25
    expect(report.averageCpuUsagePercent).toBe(46.25);

    // メモリ使用率の平均値が正常に計算されていることを確認
    // (55.0 + 58.0 + 56.0 + 52.0) / 4 = 55.25
    expect(report.averageMemoryUsagePercent).toBe(55.25);

    // ディスク使用率の平均値が正常に計算されていることを確認
    // (60.0 + 62.0 + 61.0 + 59.0) / 4 = 60.5
    expect(report.averageDiskUsagePercent).toBe(60.5);

    // API応答時間の平均値が正常に計算されていることを確認
    // (120 + 130 + 125 + 118) / 4 = 123.25
    expect(report.averageApiResponseTimeMs).toBe(123.25);

    // 月末日のデータが含まれていることにより、期間内の全データが集計されていることを検証
    expect(report.hasMonthEndData).toBe(true);
  });
});