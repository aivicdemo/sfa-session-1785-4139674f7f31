import { groupProblemsByResponseTimeline } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-556: [normal] 対応時期別の問題グループ化機能 - 短期対応の問題が正しくグループ分けされる
  test('should group problems with short-term response timeline correctly', () => {
    const today = new Date('2024-01-15T00:00:00Z');
    const shortTermDeadline1 = new Date('2024-01-18T23:59:59Z');
    const shortTermDeadline2 = new Date('2024-01-19T23:59:59Z');
    const shortTermDeadline3 = new Date('2024-01-20T23:59:59Z');

    const inputProblems = [
      {
        problemId: 'P001',
        description: 'AI inference accuracy below threshold',
        detectedAt: new Date('2024-01-15T10:00:00Z'),
        responseDueDate: shortTermDeadline1,
        responseTimeline: 'short-term',
        severity: 'high',
      },
      {
        problemId: 'P002',
        description: 'Data quality degradation detected',
        detectedAt: new Date('2024-01-15T11:00:00Z'),
        responseDueDate: shortTermDeadline2,
        responseTimeline: 'short-term',
        severity: 'medium',
      },
      {
        problemId: 'P003',
        description: 'System health check warning',
        detectedAt: new Date('2024-01-15T12:00:00Z'),
        responseDueDate: shortTermDeadline3,
        responseTimeline: 'short-term',
        severity: 'high',
      },
    ];

    const result = groupProblemsByResponseTimeline(inputProblems, today);

    expect(result).toHaveProperty('short-term');
    expect(result['short-term']).toHaveLength(3);

    const shortTermProblemIds = result['short-term'].map(
      (problem: { problemId: string }) => problem.problemId
    );
    expect(shortTermProblemIds).toContain('P001');
    expect(shortTermProblemIds).toContain('P002');
    expect(shortTermProblemIds).toContain('P003');

    if (result['medium-term']) {
      const mediumTermProblemIds = result['medium-term'].map(
        (problem: { problemId: string }) => problem.problemId
      );
      expect(mediumTermProblemIds).not.toContain('P001');
      expect(mediumTermProblemIds).not.toContain('P002');
      expect(mediumTermProblemIds).not.toContain('P003');
    }

    if (result['long-term']) {
      const longTermProblemIds = result['long-term'].map(
        (problem: { problemId: string }) => problem.problemId
      );
      expect(longTermProblemIds).not.toContain('P001');
      expect(longTermProblemIds).not.toContain('P002');
      expect(longTermProblemIds).not.toContain('P003');
    }
  });
});