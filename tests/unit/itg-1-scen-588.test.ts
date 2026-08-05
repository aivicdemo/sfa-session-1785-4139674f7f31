import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeActionPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let initialMemoryUsage: number;

  beforeEach(() => {
    initialMemoryUsage = process.memoryUsage().heapUsed;
  });

  afterEach(() => {
    if (global.gc) {
      global.gc();
    }
  });

  // SCEN-588
  test('should generate behavior pattern analysis report within timeout and memory limits for maximum volume of 10000 sales activities', async () => {
    const salesRepresentativeId = 'SR-001';
    const maxActivityVolume = 10000;
    const timeoutSeconds = 60;
    const memoryLimitBytes = 512 * 1024 * 1024;

    const mockActivities = Array.from({ length: maxActivityVolume }, (_, index) => ({
      activityId: `ACT-${String(index + 1).padStart(5, '0')}`,
      salesRepresentativeId,
      activityType: ['visit', 'call', 'email'][index % 3],
      contactDate: new Date(
        2024,
        0,
        Math.floor(index / 334) + 1,
        Math.floor((index % 334) / 14),
        (index % 14) * 4
      ).toISOString(),
      customerId: `CUST-${String((index % 500) + 1).padStart(3, '0')}`,
      duration: 15 + (index % 45),
      outcome: index % 10 === 0 ? 'success' : 'pending',
      notes: `Activity ${index + 1}`,
    }));

    const startTime = Date.now();
    const reportPromise = analyzeActionPatterns({
      salesRepresentativeId,
      activities: mockActivities,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    const result = await Promise.race([
      reportPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout exceeded')), timeoutSeconds * 1000)
      ),
    ]);

    const elapsedTimeMs = Date.now() - startTime;
    const peakMemoryUsage = process.memoryUsage().heapUsed;
    const memoryUsedBytes = peakMemoryUsage - initialMemoryUsage;

    expect(elapsedTimeMs).toBeLessThan(timeoutSeconds * 1000);
    expect(memoryUsedBytes).toBeLessThan(memoryLimitBytes);

    const reportResult = result as any;

    expect(reportResult).toHaveProperty('reportId');
    expect(reportResult).toHaveProperty('salesRepresentativeId', salesRepresentativeId);
    expect(reportResult).toHaveProperty('totalActivitiesProcessed', maxActivityVolume);
    expect(reportResult).toHaveProperty('totalActivitiesAnalyzed', maxActivityVolume);
    expect(reportResult.analysisStatus).toBe('completed');

    expect(reportResult).toHaveProperty('statistics');
    expect(reportResult.statistics).toHaveProperty('contactFrequencyPatterns');
    expect(reportResult.statistics).toHaveProperty('timeDistribution');
    expect(reportResult.statistics).toHaveProperty('activityTypeAggregation');

    const contactPatterns = reportResult.statistics.contactFrequencyPatterns as any[];
    expect(Array.isArray(contactPatterns)).toBe(true);
    expect(contactPatterns.length).toBeGreaterThan(0);

    const timeDistribution = reportResult.statistics.timeDistribution as any;
    expect(timeDistribution).toHaveProperty('hourlyBuckets');
    expect(Array.isArray(timeDistribution.hourlyBuckets)).toBe(true);
    expect(timeDistribution.hourlyBuckets.length).toBe(24);

    const activityAggregation = reportResult.statistics.activityTypeAggregation as any;
    expect(activityAggregation).toHaveProperty('visit');
    expect(activityAggregation).toHaveProperty('call');
    expect(activityAggregation).toHaveProperty('email');

    const visitCount = mockActivities.filter((a) => a.activityType === 'visit').length;
    const callCount = mockActivities.filter((a) => a.activityType === 'call').length;
    const emailCount = mockActivities.filter((a) => a.activityType === 'email').length;

    expect(activityAggregation.visit).toBe(visitCount);
    expect(activityAggregation.call).toBe(callCount);
    expect(activityAggregation.email).toBe(emailCount);

    const successCount = mockActivities.filter((a) => a.outcome === 'success').length;
    expect(reportResult.statistics).toHaveProperty('successCount', successCount);

    expect(reportResult).toHaveProperty('generatedAt');
    expect(typeof reportResult.generatedAt).toBe('string');

    const allAnalyzed = reportResult.analysisDetails.every(
      (detail: any) => detail.processed === true
    );
    expect(allAnalyzed).toBe(true);
  });
});