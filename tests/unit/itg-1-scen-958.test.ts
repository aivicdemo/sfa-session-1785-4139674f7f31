import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能 - 単一日付期間での計算', () => {
  test('SCEN-958: 開始日と終了日が同一のとき、その日単一の問題データのみでスコアが算出される', () => {
    // Arrange
    const targetDate = new Date('2024-01-15T00:00:00Z');
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-15T00:00:00Z');

    const problemDataOutsideBefore = [
      {
        problemId: 'PRB-001',
        occurredAt: new Date('2024-01-14T10:30:00Z'),
        category: 'proposal_accuracy',
        impactLevel: 'high',
        frequency: 1,
      },
      {
        problemId: 'PRB-002',
        occurredAt: new Date('2024-01-14T15:45:00Z'),
        category: 'followup_timing',
        impactLevel: 'medium',
        frequency: 2,
      },
    ];

    const problemDataOutsideAfter = [
      {
        problemId: 'PRB-005',
        occurredAt: new Date('2024-01-16T09:00:00Z'),
        category: 'customer_response_pattern',
        impactLevel: 'low',
        frequency: 1,
      },
    ];

    const problemDataInsideTarget = [
      {
        problemId: 'PRB-003',
        occurredAt: new Date('2024-01-15T08:15:00Z'),
        category: 'proposal_accuracy',
        impactLevel: 'high',
        frequency: 3,
      },
      {
        problemId: 'PRB-004',
        occurredAt: new Date('2024-01-15T14:20:00Z'),
        category: 'followup_timing',
        impactLevel: 'medium',
        frequency: 2,
      },
    ];

    const allProblems = [
      ...problemDataOutsideBefore,
      ...problemDataInsideTarget,
      ...problemDataOutsideAfter,
    ];

    // Act
    const result = calculateImprovementPriorityScore({
      problems: allProblems,
      startDate: startDate,
      endDate: endDate,
    });

    // Assert
    expect(result.usedProblemCount).toBe(2);
    expect(result.usedProblems).toHaveLength(2);

    const usedProblemIds = result.usedProblems.map((p) => p.problemId);
    expect(usedProblemIds).toContain('PRB-003');
    expect(usedProblemIds).toContain('PRB-004');
    expect(usedProblemIds).not.toContain('PRB-001');
    expect(usedProblemIds).not.toContain('PRB-002');
    expect(usedProblemIds).not.toContain('PRB-005');

    const usedOccurredDates = result.usedProblems.map((p) => p.occurredAt);
    usedOccurredDates.forEach((date) => {
      const dateString = date.toISOString().split('T')[0];
      expect(dateString).toBe('2024-01-15');
    });

    expect(result.scoreValue).toBeGreaterThanOrEqual(0);
    expect(result.scoreValue).toBeLessThanOrEqual(100);

    expect(result.excludedProblemCount).toBe(3);
    const excludedProblemIds = result.excludedProblems.map((p) => p.problemId);
    expect(excludedProblemIds).toContain('PRB-001');
    expect(excludedProblemIds).toContain('PRB-002');
    expect(excludedProblemIds).toContain('PRB-005');
  });
});