import { generateSystemHealthCheckReport } from '../../src/logic/it-1-br-2-1-1';

describe('System Health Check Report Generation - Cross-Month Period', () => {
  test('SCEN-370: generates correct aggregated report when check period spans two calendar months', () => {
    const checkStartDate = new Date('2024-01-25T00:00:00Z');
    const checkEndDate = new Date('2024-02-05T23:59:59Z');

    const healthCheckData = [
      {
        executionId: 'exec_001',
        executionTimestamp: new Date('2024-01-25T08:00:00Z'),
        systemId: 'sys_main',
        checkType: 'availability',
        result: 'success',
        executionDurationMs: 245,
      },
      {
        executionId: 'exec_002',
        executionTimestamp: new Date('2024-01-28T10:30:00Z'),
        systemId: 'sys_main',
        checkType: 'data_quality',
        result: 'success',
        executionDurationMs: 312,
      },
      {
        executionId: 'exec_003',
        executionTimestamp: new Date('2024-01-31T23:45:00Z'),
        systemId: 'sys_main',
        checkType: 'availability',
        result: 'success',
        executionDurationMs: 198,
      },
      {
        executionId: 'exec_004',
        executionTimestamp: new Date('2024-02-01T01:15:00Z'),
        systemId: 'sys_main',
        checkType: 'data_quality',
        result: 'success',
        executionDurationMs: 287,
      },
      {
        executionId: 'exec_005',
        executionTimestamp: new Date('2024-02-03T14:20:00Z'),
        systemId: 'sys_main',
        checkType: 'availability',
        result: 'failure',
        executionDurationMs: 156,
      },
      {
        executionId: 'exec_006',
        executionTimestamp: new Date('2024-02-05T16:00:00Z'),
        systemId: 'sys_main',
        checkType: 'inference_accuracy',
        result: 'success',
        executionDurationMs: 423,
      },
    ];

    const report = generateSystemHealthCheckReport({
      checkStartDate,
      checkEndDate,
      healthCheckData,
    });

    expect(report.reportPeriodStart).toEqual(new Date('2024-01-25T00:00:00Z'));
    expect(report.reportPeriodEnd).toEqual(new Date('2024-02-05T23:59:59Z'));

    expect(report.totalExecutionCount).toBe(6);

    expect(report.successCount).toBe(5);
    expect(report.failureCount).toBe(1);

    const expectedSuccessRate = (5 / 6) * 100;
    expect(report.successRate).toBeCloseTo(expectedSuccessRate, 2);

    expect(report.includesJanuaryData).toBe(true);
    expect(report.includesFebruaryData).toBe(true);

    expect(report.januaryExecutionCount).toBe(3);
    expect(report.februaryExecutionCount).toBe(3);

    const januaryExecutions = report.executionsByMonth.find(
      (m) => m.month === '2024-01'
    );
    expect(januaryExecutions).toBeDefined();
    expect(januaryExecutions?.executionCount).toBe(3);
    expect(januaryExecutions?.successCount).toBe(3);

    const februaryExecutions = report.executionsByMonth.find(
      (m) => m.month === '2024-02'
    );
    expect(februaryExecutions).toBeDefined();
    expect(februaryExecutions?.executionCount).toBe(3);
    expect(februaryExecutions?.successCount).toBe(2);
    expect(februaryExecutions?.failureCount).toBe(1);

    expect(report.boundaryDateCoverage.startBoundaryIncluded).toBe(true);
    expect(report.boundaryDateCoverage.endBoundaryIncluded).toBe(true);
    expect(report.boundaryDateCoverage.crossMonthBoundaryValid).toBe(true);

    const januaryToFebruaryTransition = report.executionsByDate.filter(
      (d) =>
        d.date === '2024-01-31' ||
        d.date === '2024-02-01'
    );
    expect(januaryToFebruaryTransition.length).toBe(2);

    const jan31Data = januaryToFebruaryTransition.find(
      (d) => d.date === '2024-01-31'
    );
    expect(jan31Data?.executionCount).toBe(1);
    expect(jan31Data?.successCount).toBe(1);

    const feb01Data = januaryToFebruaryTransition.find(
      (d) => d.date === '2024-02-01'
    );
    expect(feb01Data?.executionCount).toBe(1);
    expect(feb01Data?.successCount).toBe(1);

    expect(report.aggregatedMetrics.totalDurationMs).toBe(1621);
    expect(report.aggregatedMetrics.averageDurationMs).toBeCloseTo(270.17, 1);

    expect(report.dataIntegrity.duplicateRecordCount).toBe(0);
    expect(report.dataIntegrity.omittedRecordCount).toBe(0);
    expect(report.dataIntegrity.isConsistent).toBe(true);

    expect(report.checkTypeDistribution).toEqual({
      availability: 3,
      data_quality: 2,
      inference_accuracy: 1,
    });

    expect(Array.isArray(report.executionsByDate)).toBe(true);
    expect(report.executionsByDate.length).toBeGreaterThan(0);
  });
});