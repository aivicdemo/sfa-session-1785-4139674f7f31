import { detectDeviationPattern } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-306
  test('乖離パターンが定義ルールのいずれにも該当しないとき、混在型パターンとして検出される', () => {
    const input = {
      salesRepId: 'SR001',
      processStepSequence: [
        { step: 'initial_contact', expectedDaysFromStart: 0, actualDaysFromStart: 0 },
        { step: 'proposal', expectedDaysFromStart: 5, actualDaysFromStart: 8 },
        { step: 'negotiation', expectedDaysFromStart: 15, actualDaysFromStart: 12 },
        { step: 'closure', expectedDaysFromStart: 30, actualDaysFromStart: 35 }
      ],
      predefinedRules: [
        {
          ruleId: 'monotonic_increase',
          ruleName: '単調増加型',
          condition: (deviations: number[]) => deviations.every((d, i) => i === 0 || d >= deviations[i - 1])
        },
        {
          ruleId: 'periodic_fluctuation',
          ruleName: '周期変動型',
          condition: (deviations: number[]) => {
            if (deviations.length < 4) return false;
            const pattern = deviations.map((d, i) => i % 2 === 0 ? d > 0 : d < 0);
            return pattern.every((p, i) => i === 0 || p === pattern[0]);
          }
        },
        {
          ruleId: 'stepwise_change',
          ruleName: '段階的変化型',
          condition: (deviations: number[]) => {
            const segments = [];
            let currentSegment = [deviations[0]];
            for (let i = 1; i < deviations.length; i++) {
              if (Math.abs(deviations[i] - deviations[i - 1]) < 2) {
                currentSegment.push(deviations[i]);
              } else {
                segments.push(currentSegment);
                currentSegment = [deviations[i]];
              }
            }
            return segments.length >= 2;
          }
        }
      ]
    };

    const result = detectDeviationPattern(input);

    expect(result.patternType).toBe('混在型');
    expect(result.matchedRuleIds).toEqual([]);
    expect(result.deviationValues).toEqual([0, 3, -3, 5]);
    expect(result.salesRepId).toBe('SR001');
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});