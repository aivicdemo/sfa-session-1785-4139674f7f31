import { expect, describe, test, beforeEach } from '@jest/globals';
import { groupProblemsByResponseTiming } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-562
  test('should throw error when problem is missing response timing field', () => {
    const problemWithoutTiming = {
      problemId: 'PROB-001',
      description: '提案内容の妥当性が低い',
      severity: 'high',
      detectedAt: new Date('2024-01-15T11:00:00Z'),
      responseTiming: null,
      assignee: 'manager-001'
    };

    expect(() => groupProblemsByResponseTiming([problemWithoutTiming])).toThrow(/対応時期/);
  });
});