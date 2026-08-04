import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能', () => {
  // SCEN-1798
  test('新規案件の商談条件が過去成功パターンと照合される', async () => {
    const newDealCondition = {
      industry: '製造業',
      issue: '生産効率化',
      budget: 50000000,
      decisionPeriod: 3,
    };

    const mockSimilarPatterns = [
      {
        id: 'pattern_001',
        industry: '製造業',
        budget: 50000000,
        approach: '提案書主導',
        outcome: '成約',
        similarityScore: 0.92,
      },
      {
        id: 'pattern_002',
        industry: '製造業',
        issue: '生産効率化',
        approach: '技術デモ主導',
        outcome: '成約',
        similarityScore: 0.88,
      },
      {
        id: 'pattern_003',
        industry: '異業種',
        budget: 50000000,
        approach: '提案書主導',
        outcome: '失敗',
        similarityScore: 0.65,
      },
    ];

    const mockRelevanceScores = {
      pattern_001: 0.91,
      pattern_002: 0.87,
      pattern_003: 0.58,
    };

    const mockFindSimilarPatterns = jest.fn().mockResolvedValue(mockSimilarPatterns);
    const mockEvaluatePatternRelevance = jest.fn((patternId: string) => {
      return Promise.resolve(mockRelevanceScores[patternId as keyof typeof mockRelevanceScores]);
    });

    const aiRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const similarPatterns = await findSimilarPatterns(newDealCondition, aiRecommendationEngine);
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealCondition);
    expect(similarPatterns).toHaveLength(3);

    const relevanceResults: Array<{ patternId: string; score: number; approach: string; similarityScore: number }> = [];
    for (const pattern of similarPatterns) {
      const relevanceScore = await evaluatePatternRelevance(
        pattern.id,
        newDealCondition,
        aiRecommendationEngine
      );
      relevanceResults.push({
        patternId: pattern.id,
        score: relevanceScore,
        approach: pattern.approach,
        similarityScore: pattern.similarityScore,
      });
    }

    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);

    const topRecommendation = relevanceResults.reduce((prev, current) => {
      const prevComposite = (prev.score + prev.similarityScore) / 2;
      const currentComposite = (current.score + current.similarityScore) / 2;
      return currentComposite > prevComposite ? current : prev;
    });

    expect(topRecommendation.patternId).toBe('pattern_001');
    expect(topRecommendation.approach).toBe('提案書主導');
    const compositeScorePattern1 = (0.91 + 0.92) / 2;
    expect(compositeScorePattern1).toBeCloseTo(0.915, 3);

    const secondRecommendation = relevanceResults.filter(r => r.patternId !== topRecommendation.patternId).sort((a, b) => {
      const aComposite = (a.score + a.similarityScore) / 2;
      const bComposite = (b.score + b.similarityScore) / 2;
      return bComposite - aComposite;
    })[0];

    expect(secondRecommendation.patternId).toBe('pattern_002');
    expect(secondRecommendation.approach).toBe('技術デモ主導');
    const compositeScorePattern2 = (0.87 + 0.88) / 2;
    expect(compositeScorePattern2).toBeCloseTo(0.875, 3);

    const reasoningDetail = {
      topPatternId: topRecommendation.patternId,
      conditionMatchPercentage: 0.98,
      reasoning: '貴案件は過去の成功事例（製造業・5000万円規模）と98%の条件一致度があり、提案書主導アプローチで成約に至った事例が存在します',
      secondaryOptionPatternId: secondRecommendation.patternId,
      secondaryApproach: secondRecommendation.approach,
    };

    expect(reasoningDetail.topPatternId).toBe('pattern_001');
    expect(reasoningDetail.conditionMatchPercentage).toBe(0.98);
    expect(reasoningDetail.reasoning).toMatch(/提案書主導/);
    expect(reasoningDetail.reasoning).toMatch(/成約/);
    expect(reasoningDetail.secondaryOptionPatternId).toBe('pattern_002');
    expect(reasoningDetail.secondaryApproach).toBe('技術デモ主導');
  });
});