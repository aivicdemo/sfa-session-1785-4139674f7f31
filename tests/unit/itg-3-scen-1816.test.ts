import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  test('SCEN-1816: 複数の成功パターンが各々のスコアで評価される', () => {
    const patternA = {
      id: 'pattern_001',
      name: 'パターンA',
      customerSize: 'large',
      industry: 'manufacturing',
      budgetRange: 50000000,
    };

    const patternB = {
      id: 'pattern_002',
      name: 'パターンB',
      customerSize: 'large',
      industry: 'manufacturing',
      budgetRange: 50000000,
    };

    const patternC = {
      id: 'pattern_003',
      name: 'パターンC',
      customerSize: 'large',
      industry: 'manufacturing',
      budgetRange: 50000000,
    };

    const dealCondition = {
      customerSize: 'large',
      industry: 'manufacturing',
      budgetRange: 50000000,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockReturnValueOnce({ patternId: 'pattern_001', relevanceScore: 0.92 })
        .mockReturnValueOnce({ patternId: 'pattern_002', relevanceScore: 0.78 })
        .mockReturnValueOnce({ patternId: 'pattern_003', relevanceScore: 0.65 }),
    };

    const result = evaluatePatternRelevance(
      [patternA, patternB, patternC],
      dealCondition,
      mockAIEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        evaluations: expect.arrayContaining([
          expect.objectContaining({
            patternId: 'pattern_001',
            relevanceScore: 0.92,
          }),
          expect.objectContaining({
            patternId: 'pattern_002',
            relevanceScore: 0.78,
          }),
          expect.objectContaining({
            patternId: 'pattern_003',
            relevanceScore: 0.65,
          }),
        ]),
      })
    );

    result.evaluations.forEach((evaluation: { relevanceScore: number }) => {
      expect(evaluation.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.relevanceScore).toBeLessThanOrEqual(1);
    });

    expect(result.evaluations[0].relevanceScore).toBe(0.92);
    expect(result.evaluations[1].relevanceScore).toBe(0.78);
    expect(result.evaluations[2].relevanceScore).toBe(0.65);

    expect(result.evaluations[0].relevanceScore).toBeGreaterThan(
      result.evaluations[1].relevanceScore
    );
    expect(result.evaluations[1].relevanceScore).toBeGreaterThan(
      result.evaluations[2].relevanceScore
    );
  });
});