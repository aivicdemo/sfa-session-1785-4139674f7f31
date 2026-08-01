import { groupProblemsByResponseTimeframe } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-554: [normal] 対応時期別の問題グループ化機能 - 複数の問題が対応時期別にグループ化される
  test('should group multiple problems by response timeframe into 4 categories', () => {
    const problems = [
      {
        id: 'problem_1',
        description: 'Critical system error',
        responseTimeframe: 'urgent',
        detectedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 'problem_2',
        description: 'Data quality issue 1',
        responseTimeframe: 'urgent',
        detectedAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: 'problem_3',
        description: 'Performance degradation',
        responseTimeframe: 'urgent',
        detectedAt: new Date('2024-01-15T12:00:00Z'),
      },
      {
        id: 'problem_4',
        description: 'Minor config drift',
        responseTimeframe: 'short_term',
        detectedAt: new Date('2024-01-15T13:00:00Z'),
      },
      {
        id: 'problem_5',
        description: 'Process alignment gap',
        responseTimeframe: 'short_term',
        detectedAt: new Date('2024-01-15T14:00:00Z'),
      },
      {
        id: 'problem_6',
        description: 'Training material update needed',
        responseTimeframe: 'short_term',
        detectedAt: new Date('2024-01-15T15:00:00Z'),
      },
      {
        id: 'problem_7',
        description: 'Medium-term infrastructure planning',
        responseTimeframe: 'medium_term',
        detectedAt: new Date('2024-01-15T16:00:00Z'),
      },
      {
        id: 'problem_8',
        description: 'Process documentation review',
        responseTimeframe: 'medium_term',
        detectedAt: new Date('2024-01-15T17:00:00Z'),
      },
      {
        id: 'problem_9',
        description: 'Strategic system redesign',
        responseTimeframe: 'medium_term',
        detectedAt: new Date('2024-01-15T18:00:00Z'),
      },
      {
        id: 'problem_10',
        description: 'Long-term capability building',
        responseTimeframe: 'long_term',
        detectedAt: new Date('2024-01-15T19:00:00Z'),
      },
      {
        id: 'problem_11',
        description: 'Organizational transformation',
        responseTimeframe: 'long_term',
        detectedAt: new Date('2024-01-15T20:00:00Z'),
      },
      {
        id: 'problem_12',
        description: 'Future roadmap alignment',
        responseTimeframe: 'long_term',
        detectedAt: new Date('2024-01-15T21:00:00Z'),
      },
    ];

    const result = groupProblemsByResponseTimeframe(problems);

    expect(Object.keys(result)).toHaveLength(4);
    expect(result).toHaveProperty('urgent');
    expect(result).toHaveProperty('short_term');
    expect(result).toHaveProperty('medium_term');
    expect(result).toHaveProperty('long_term');

    expect(result.urgent).toHaveLength(3);
    expect(result.urgent.map((p) => p.id)).toEqual([
      'problem_1',
      'problem_2',
      'problem_3',
    ]);
    expect(result.urgent.every((p) => p.responseTimeframe === 'urgent')).toBe(
      true
    );

    expect(result.short_term).toHaveLength(3);
    expect(result.short_term.map((p) => p.id)).toEqual([
      'problem_4',
      'problem_5',
      'problem_6',
    ]);
    expect(
      result.short_term.every((p) => p.responseTimeframe === 'short_term')
    ).toBe(true);

    expect(result.medium_term).toHaveLength(3);
    expect(result.medium_term.map((p) => p.id)).toEqual([
      'problem_7',
      'problem_8',
      'problem_9',
    ]);
    expect(
      result.medium_term.every((p) => p.responseTimeframe === 'medium_term')
    ).toBe(true);

    expect(result.long_term).toHaveLength(3);
    expect(result.long_term.map((p) => p.id)).toEqual([
      'problem_10',
      'problem_11',
      'problem_12',
    ]);
    expect(result.long_term.every((p) => p.responseTimeframe === 'long_term'))
      .toBe(true);
  });
});