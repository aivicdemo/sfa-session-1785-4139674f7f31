import { evaluatePatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('Pattern Applicability Evaluation - Single Pattern', () => {
  // SCEN-063
  test('should return evaluation result with score 0.85 when single pattern is evaluated', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const testData = {
      patternId: 'PATTERN-001',
      customerIndustry: '製造業',
      dealAmount: '5000万円',
    };

    const evaluationPatterns = [
      {
        patternId: 'PATTERN-001',
        customerIndustry: '製造業',
        dealAmount: '5000万円',
      },
    ];

    const before = new Date('2024-01-15T11:00:00Z');
    const result = evaluatePatterns(
      testData,
      evaluationPatterns,
      mockAIEngine
    );
    const after = new Date('2024-01-15T11:00:01Z');

    expect(result.score).toBe(0.85);
    expect(result.patternId).toBe('PATTERN-001');
    expect(result.evaluationStatus).toBe('COMPLETED');
    expect(result.executedAt).toBeInstanceOf(Date);
    expect(result.executedAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime()
    );
    expect(result.executedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});