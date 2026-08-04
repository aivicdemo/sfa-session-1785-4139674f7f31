import { PatternApplicabilityJudgment } from '../../src/logic/it-1-br-3-3-2-1';

describe('Pattern Applicability Judgment - Success Pattern Evaluation', () => {
  // SCEN-639
  test('should judge applicability when one success pattern is available', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'PAT-001',
        patternName: '大規模案件向け段階提案法',
        relevanceScore: 0.85,
      }),
    };

    const dealCondition = {
      customerId: 'CUST-123',
      dealSize: 5000000,
      industry: 'IT',
      decision_maker_count: 3,
    };

    const judgment = new PatternApplicabilityJudgment(mockAIRecommendationEngine);
    const result = judgment.judgeApplicability(dealCondition);

    expect(result.applicablePatterns).toHaveLength(1);
    expect(result.applicablePatterns[0]).toEqual({
      patternId: 'PAT-001',
      patternName: '大規模案件向け段階提案法',
      relevanceScore: 0.85,
      applicable: true,
    });
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealCondition);
  });
});