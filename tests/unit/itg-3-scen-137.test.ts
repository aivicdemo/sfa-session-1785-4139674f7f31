import { evaluatePatternRelevance, generateRecommendation, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性スコア判定機能', () => {
  // SCEN-137
  test('適用可能性スコアが許可ライン直上で推論が実行される', async () => {
    const mockEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0.700,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn().mockResolvedValue({
        approachId: 'approach-001',
        approachName: '製造業向け予算最適化提案',
        successPatterns: [
          {
            patternId: 'pattern-001',
            industryType: '製造業',
            budgetRange: '1000万円以上',
            decisionMakers: 3,
            approachType: '経営効率化',
            adoptionRate: 0.75,
          },
          {
            patternId: 'pattern-002',
            industryType: '製造業',
            budgetRange: '1000万円以上',
            decisionMakers: 3,
            approachType: 'コスト削減',
            adoptionRate: 0.68,
          },
        ],
        confidence: 0.82,
        reasoning: '過去5年の類似案件から抽出した最適パターン',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          {
            caseId: 'case-001',
            industry: '製造業',
            budget: '1000万円以上',
            decisionMakerCount: 3,
            closureRate: 0.78,
            timeToClose: 45,
          },
          {
            caseId: 'case-002',
            industry: '製造業',
            budget: '1000万円以上',
            decisionMakerCount: 3,
            closureRate: 0.72,
            timeToClose: 38,
          },
        ],
        matchScore: 0.695,
      }),
    };

    const newDealCondition = {
      industryType: '製造業',
      budgetRange: '1000万円以上',
      decisionMakerCount: 3,
      currentChallenges: ['コスト効率', '生産性向上'],
      purchaseTimeline: '6ヶ月以内',
    };

    const relevanceResult = await mockEngine.evaluatePatternRelevance(newDealCondition);

    expect(relevanceResult.score).toBe(0.700);
    expect(relevanceResult.isApplicable).toBe(true);

    const recommendationResult = await mockEngine.generateRecommendation(newDealCondition);

    expect(mockEngine.generateRecommendation).toHaveBeenCalledWith(newDealCondition);
    expect(recommendationResult.approachId).toBe('approach-001');
    expect(recommendationResult.successPatterns).toHaveLength(2);
    expect(recommendationResult.successPatterns[0]).toEqual({
      patternId: 'pattern-001',
      industryType: '製造業',
      budgetRange: '1000万円以上',
      decisionMakers: 3,
      approachType: '経営効率化',
      adoptionRate: 0.75,
    });
    expect(recommendationResult.confidence).toBe(0.82);

    const similarPatternsResult = await mockEngine.findSimilarPatterns(newDealCondition);

    expect(mockEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(similarPatternsResult.patterns).toHaveLength(2);
    expect(similarPatternsResult.patterns[0].industry).toBe('製造業');
    expect(similarPatternsResult.patterns[0].budget).toBe('1000万円以上');
    expect(similarPatternsResult.patterns[0].decisionMakerCount).toBe(3);
    expect(similarPatternsResult.matchScore).toBe(0.695);

    expect(mockEngine.evaluatePatternRelevance).toHaveBeenCalledWith(newDealCondition);
    expect(mockEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
  });
});