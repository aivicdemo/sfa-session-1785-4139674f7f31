import { classifyIssuesByPriorityAndSeverity } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-519
  test('複数の問題が検出された場合、全ての問題が優先度で正しく分類される', () => {
    const issueA = {
      id: 'issue-a',
      severity: 'high' as const,
      detectedAt: new Date('2024-01-15T10:00:00Z'),
      description: 'Problem A'
    };

    const issueB = {
      id: 'issue-b',
      severity: 'low' as const,
      detectedAt: new Date('2024-01-15T10:05:00Z'),
      description: 'Problem B'
    };

    const issueC = {
      id: 'issue-c',
      severity: 'medium' as const,
      detectedAt: new Date('2024-01-15T10:02:00Z'),
      description: 'Problem C'
    };

    const issueD = {
      id: 'issue-d',
      severity: 'high' as const,
      detectedAt: new Date('2024-01-15T10:01:00Z'),
      description: 'Problem D'
    };

    const issues = [issueA, issueB, issueC, issueD];

    const classifiedResult = classifyIssuesByPriorityAndSeverity(issues);

    expect(classifiedResult).toHaveLength(4);

    expect(classifiedResult[0]).toEqual({
      id: 'issue-d',
      severity: 'high',
      detectedAt: new Date('2024-01-15T10:01:00Z'),
      description: 'Problem D',
      priority: 1
    });

    expect(classifiedResult[1]).toEqual({
      id: 'issue-a',
      severity: 'high',
      detectedAt: new Date('2024-01-15T10:00:00Z'),
      description: 'Problem A',
      priority: 2
    });

    expect(classifiedResult[2]).toEqual({
      id: 'issue-c',
      severity: 'medium',
      detectedAt: new Date('2024-01-15T10:02:00Z'),
      description: 'Problem C',
      priority: 3
    });

    expect(classifiedResult[3]).toEqual({
      id: 'issue-b',
      severity: 'low',
      detectedAt: new Date('2024-01-15T10:05:00Z'),
      description: 'Problem B',
      priority: 4
    });
  });
});