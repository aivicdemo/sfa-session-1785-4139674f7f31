import { describe, test, expect } from '@jest/globals';
import { analyzeSalesRepBehaviorPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-188
  test('乖離度と成約実績の相関係数が1.0未満の場合、部分相関として判定される', () => {
    const salesRepId = 'REP-001';
    const deviationScores = [0.15, 0.22, 0.18, 0.25, 0.20];
    const contractResults = [1, 1, 0, 1, 1];
    const correlationCoefficient = 0.95;

    const result = analyzeSalesRepBehaviorPattern({
      salesRepId,
      deviationScores,
      contractResults,
      correlationCoefficient,
    });

    expect(result.correlationType).toBe('partial');
    expect(result.improvementGuidanceStatus).toBe('conditional');
    expect(result.correlationCoefficient).toBe(0.95);
    expect(result.correlationCoefficient).toBeGreaterThanOrEqual(0.7);
    expect(result.correlationCoefficient).toBeLessThan(1.0);
  });
});