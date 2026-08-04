import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性判定機能', () => {
  // SCEN-640
  test('成功パターンが複数件のとき、すべてのパターンに対して適用判定を実行する', () => {
    const dealCondition = {
      customerScale: 'mid_enterprise',
      industry: 'manufacturing',
      budgetAmount: 50000000,
      implementationTimeline: 'within_3_months',
    };

    const successPatterns = [
      {
        patternId: 'pattern_A',
        name: 'パターンA',
        description: '製造業向けシステム導入パターン',
      },
      {
        patternId: 'pattern_B',
        name: 'パターンB',
        description: '中堅企業向けコスト最適化パターン',
      },
      {
        patternId: 'pattern_C',
        name: 'パターンC',
        description: 'クイック導入パターン',
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern, condition) => {
        if (pattern.patternId === 'pattern_A') {
          return {
            patternId: 'pattern_A',
            relevanceScore: 0.92,
            applicabilityFlag: true,
          };
        }
        if (pattern.patternId === 'pattern_B') {
          return {
            patternId: 'pattern_B',
            relevanceScore: 0.87,
            applicabilityFlag: true,
          };
        }
        if (pattern.patternId === 'pattern_C') {
          return {
            patternId: 'pattern_C',
            relevanceScore: 0.78,
            applicabilityFlag: true,
          };
        }
        return {
          patternId: pattern.patternId,
          relevanceScore: 0.0,
          applicabilityFlag: false,
        };
      }),
    };

    const result = evaluatePatternRelevance(
      successPatterns,
      dealCondition,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    expect(result[0]).toEqual({
      patternId: 'pattern_A',
      relevanceScore: 0.92,
      applicabilityFlag: true,
    });

    expect(result[1]).toEqual({
      patternId: 'pattern_B',
      relevanceScore: 0.87,
      applicabilityFlag: true,
    });

    expect(result[2]).toEqual({
      patternId: 'pattern_C',
      relevanceScore: 0.78,
      applicabilityFlag: true,
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      successPatterns[0],
      dealCondition
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      successPatterns[1],
      dealCondition
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      successPatterns[2],
      dealCondition
    );
  });
});