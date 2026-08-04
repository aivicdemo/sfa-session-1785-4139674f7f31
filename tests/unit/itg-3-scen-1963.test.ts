import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1963: [edge] 成功パターン抽出・照合機能 - 顧客業種が部分一致するパターンが次点で適用される
  test('部分一致パターンが完全一致パターン不在時に次点で推奨される', () => {
    // Mock AI service that simulates pattern matching behavior
    const mockAIService = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_partial_match',
          industry: '製造',
          score: 80,
          approachType: 'partial_match_approach',
          successRate: 0.78,
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_12345',
        patternId: 'pattern_partial_match',
        proposalApproach: '部分一致パターンに基づく提案アプローチ',
        relevanceScore: 80,
        reasoning: '顧客の業種が部分的に一致した過去成功事例に基づいています',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 80,
        isApplicable: true,
        matchType: 'partial',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '顧客の業種が部分的に一致した過去成功事例に基づいています',
        confidenceLevel: 0.80,
      }),
    };

    // Initialize AIRecommendationEngine with mock service
    const engine = new AIRecommendationEngine(mockAIService);

    // Register patterns in recommendation master
    const patternMaster = [
      {
        patternId: 'pattern_exact_match',
        industry: '製造業',
        score: 95,
        approachType: 'exact_match_approach',
        successRate: 0.95,
      },
      {
        patternId: 'pattern_partial_match',
        industry: '製造',
        score: 80,
        approachType: 'partial_match_approach',
        successRate: 0.78,
      },
      {
        patternId: 'pattern_other_industry',
        industry: '小売業',
        score: 60,
        approachType: 'other_industry_approach',
        successRate: 0.62,
      },
    ];

    engine.registerPatterns(patternMaster);

    // Prepare new project input data
    const newProjectData = {
      customerId: 'cust_001',
      customerIndustry: '製造',
      projectPhase: 'initial_contact',
      estimatedBudget: 5000000,
      timelineConstraint: '3_months',
      specificRequirements: ['cost_reduction', 'process_automation'],
    };

    // Execute generateRecommendation
    const recommendationResult = engine.generateRecommendation(newProjectData);

    // Verify returned recommendation pattern
    expect(recommendationResult.patternId).toBe('pattern_partial_match');
    expect(recommendationResult.relevanceScore).toBe(80);
    expect(recommendationResult.proposalApproach).toBe(
      '部分一致パターンに基づく提案アプローチ'
    );

    // Verify pattern ranking
    const patternRanking = engine.evaluatePatternRelevance(newProjectData);
    expect(patternRanking.score).toBe(80);
    expect(patternRanking.isApplicable).toBe(true);
    expect(patternRanking.matchType).toBe('partial');

    // Verify explanation includes partial match mention
    const explanation = engine.explainRecommendationReasoning(
      recommendationResult
    );
    expect(explanation.explanation).toContain('顧客の業種が部分的に一致した過去成功事例に基づいています');
    expect(explanation.confidenceLevel).toBe(0.80);

    // Verify excluded patterns
    const excludedPatterns = engine.getExcludedPatterns(newProjectData);
    expect(excludedPatterns).toContain('pattern_exact_match');
    expect(excludedPatterns).toContain('pattern_other_industry');
    expect(excludedPatterns).not.toContain('pattern_partial_match');
  });
});