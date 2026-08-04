import { calculatePatternStatistics } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの統計集計機能', () => {
  test('SCEN-317: 推奨パターンマスタが1件のとき、その単一パターンが統計上の最上位になる', () => {
    const single_pattern = {
      patternId: 'PATTERN-001',
      patternName: '初回提案型アプローチ',
      successCount: 5,
      failureCount: 1,
      winRate: 0.833,
      lastUpdated: '2026-01-01',
    };

    const patterns = [single_pattern];

    const result = calculatePatternStatistics(patterns);

    expect(result.topPattern.patternId).toBe('PATTERN-001');
    expect(result.topPattern.rank).toBe(1);
    expect(result.topPattern.successCount).toBe(5);
    expect(result.topPattern.winRate).toBe(0.833);
    expect(result.statisticalSummary.totalPatterns).toBe(1);
    expect(result.statisticalSummary.topPatternPercentage).toBe(100);
  });
});