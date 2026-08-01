import { calculatePriorityAndReportingStatus } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-608: 重要度スコアが最大値の場合最高優先度として報告対象に判定される', () => {
    const problemDetectionResult = {
      detectionId: 'detection_001',
      severity: 100,
      pattern: 'proposal_mismatch',
      timestamp: new Date('2024-01-15T11:00:00Z'),
      affectedSalesRepId: 'rep_001',
    };

    const result = calculatePriorityAndReportingStatus(problemDetectionResult);

    expect(result.priorityLevel).toBe(5);
    expect(result.priorityLabel).toBe('最高');
    expect(result.shouldReport).toBe(true);
  });
});