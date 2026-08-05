import { describe, test, expect } from '@jest/globals';
import { startMonitoring } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-562
  test('推論精度の閾値が欠落している場合、エラーになる', () => {
    const inferenceResultSet = [
      {
        inferenceId: 'inf-001',
        modelOutput: 'success_pattern_a',
        actualOutcome: 'success_pattern_a',
        timestamp: new Date('2024-01-15T11:00:00Z'),
      },
      {
        inferenceId: 'inf-002',
        modelOutput: 'success_pattern_b',
        actualOutcome: 'success_pattern_b',
        timestamp: new Date('2024-01-15T11:05:00Z'),
      },
    ];

    const monitoringConfig = {
      agentId: 'agent-001',
      monitoringInterval: 3600,
      alertEnabled: true,
    };

    expect(() => startMonitoring(inferenceResultSet, monitoringConfig)).toThrow(/閾値|threshold/);
  });
});