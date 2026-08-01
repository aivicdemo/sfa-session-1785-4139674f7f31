import { determineProblemResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-535
  test('短期対応が必要な問題が検出された場合、対応時期として短期が指定される', () => {
    const detectionDate = new Date('2024-01-15T09:00:00Z');
    const expectedDeadline = new Date('2024-01-16T17:00:00Z');

    const problemData = {
      problemId: 'PRB-001',
      detectionDateTime: detectionDate,
      severity: 'HIGH',
      impactScope: 'ORGANIZATION_WIDE',
      recommendedResponsePeriod: '24_HOURS'
    };

    const result = determineProblemResponseTiming(problemData);

    expect(result.responseTiming).toBe('SHORT_TERM');
    expect(result.responseDeadline).toEqual(expectedDeadline);
  });
});