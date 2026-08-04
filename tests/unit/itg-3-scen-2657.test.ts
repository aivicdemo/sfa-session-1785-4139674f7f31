import { evaluateSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能', () => {
  // SCEN-2657
  test('複数件のテンプレートがすべて判定対象として処理される', () => {
    const successPatternTemplates = [
      {
        patternId: 'PATTERN-001',
        name: 'IT業界向け提案パターンA',
        customerSegment: 'IT',
        budgetRange: '500万円以上',
        decisionMaker: 'CTO',
      },
      {
        patternId: 'PATTERN-002',
        name: 'IT業界向け提案パターンB',
        customerSegment: 'IT',
        budgetRange: '300万円以上',
        decisionMaker: 'CIO',
      },
      {
        patternId: 'PATTERN-003',
        name: 'IT業界向け提案パターンC',
        customerSegment: 'IT',
        budgetRange: '1000万円以上',
        decisionMaker: 'VP Engineering',
      },
    ];

    const newDealCondition = {
      customerIndustry: 'IT',
      budgetAmount: 5000000,
      decisionMakerRole: 'CTO',
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((pattern, condition) => {
        if (pattern.patternId === 'PATTERN-001') {
          return 0.95;
        } else if (pattern.patternId === 'PATTERN-002') {
          return 0.87;
        } else if (pattern.patternId === 'PATTERN-003') {
          return 0.72;
        }
        return 0.0;
      }),
    };

    const result = evaluateSuccessPatterns(
      successPatternTemplates,
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      successPatternTemplates[0],
      newDealCondition
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      successPatternTemplates[1],
      newDealCondition
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      successPatternTemplates[2],
      newDealCondition
    );

    expect(result.evaluatedPatterns).toHaveLength(3);
    expect(result.evaluatedPatterns[0]).toEqual({
      patternId: 'PATTERN-001',
      relevanceScore: 0.95,
      evaluationStatus: 'completed',
    });
    expect(result.evaluatedPatterns[1]).toEqual({
      patternId: 'PATTERN-002',
      relevanceScore: 0.87,
      evaluationStatus: 'completed',
    });
    expect(result.evaluatedPatterns[2]).toEqual({
      patternId: 'PATTERN-003',
      relevanceScore: 0.72,
      evaluationStatus: 'completed',
    });

    expect(result.totalPatternsEvaluated).toBe(3);
    expect(result.allPatternsCompleted).toBe(true);
  });
});