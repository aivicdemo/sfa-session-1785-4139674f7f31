import { evaluateImprovementPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-293
  test('標準プロセスとの乖離度が負の値の場合、改善指導対象外と判定される', () => {
    const input = {
      salesRepId: 'rep_001',
      deviationPercentage: -5.0,
      salesContractRate: 45.5,
      processComplianceChecklist: [
        { stepName: '初回接触', completed: true },
        { stepName: '提案', completed: true },
        { stepName: '交渉', completed: false },
        { stepName: '成約', completed: false }
      ],
      followUpFrequencyPerMonth: 8,
      proposalAccuracyScore: 72.0,
      analysisTimestamp: new Date('2024-01-15T14:30:00Z')
    };

    const result = evaluateImprovementPriority(input);

    expect(result.isTargetForImprovement).toBe(false);
    expect(result.priorityLevel).toBeNull();
    expect(result.isExcludedFromImprovement).toBe(true);
    expect(result.deviationPercentage).toBe(-5.0);
    expect(result.exclusionReason).toBe('negative_deviation');
  });
});