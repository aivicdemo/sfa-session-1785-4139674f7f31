import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-891
  test('根拠データの類似度スコアが同値で並ぶとき全件が根拠として提示される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '業務効率化を重点とした提案',
        confidenceScore: 85,
        similarPatternIds: ['PATTERN_001', 'PATTERN_002', 'PATTERN_003'],
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN_001',
          similarityScore: 0.85,
          successCaseOutline: '同規模企業での業務プロセス自動化事例',
          customerSize: 'mid_enterprise',
          industry: 'manufacturing',
          challengeCategory: 'business_efficiency',
        },
        {
          patternId: 'PATTERN_002',
          similarityScore: 0.85,
          successCaseOutline: '中堅製造業での工程改善による効率向上事例',
          customerSize: 'mid_enterprise',
          industry: 'manufacturing',
          challengeCategory: 'business_efficiency',
        },
        {
          patternId: 'PATTERN_003',
          similarityScore: 0.85,
          successCaseOutline: '業務効率化ツール導入による成功事例',
          customerSize: 'mid_enterprise',
          industry: 'retail',
          challengeCategory: 'business_efficiency',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoningExplanation:
          '過去3件の類似事例から高い適合度を確認。すべて業務効率化における成功実績あり。',
        supportingPatterns: [
          {
            patternId: 'PATTERN_001',
            similarityScore: 0.85,
            successCaseOutline: '同規模企業での業務プロセス自動化事例',
            displayOrder: 1,
          },
          {
            patternId: 'PATTERN_002',
            similarityScore: 0.85,
            successCaseOutline: '中堅製造業での工程改善による効率向上事例',
            displayOrder: 2,
          },
          {
            patternId: 'PATTERN_003',
            similarityScore: 0.85,
            successCaseOutline: '業務効率化ツール導入による成功事例',
            displayOrder: 3,
          },
        ],
      }),
    };

    const newDealData = {
      customerSize: 'mid_enterprise',
      dealStage: 'pre_proposal',
      challengeCategory: 'business_efficiency',
      estimatedValue: 5000000,
    };

    const recommendationResult = generateRecommendation(newDealData, mockAIRecommendationEngine);

    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.recommendedApproach).toBe('業務効率化を重点とした提案');
    expect(recommendationResult.confidenceScore).toBe(85);

    const reasoningResult = explainRecommendationReasoning(
      recommendationResult,
      mockAIRecommendationEngine
    );

    expect(reasoningResult).toBeDefined();
    expect(reasoningResult.supportingPatterns).toHaveLength(3);

    expect(reasoningResult.supportingPatterns[0]).toEqual({
      patternId: 'PATTERN_001',
      similarityScore: 0.85,
      successCaseOutline: '同規模企業での業務プロセス自動化事例',
      displayOrder: 1,
    });

    expect(reasoningResult.supportingPatterns[1]).toEqual({
      patternId: 'PATTERN_002',
      similarityScore: 0.85,
      successCaseOutline: '中堅製造業での工程改善による効率向上事例',
      displayOrder: 2,
    });

    expect(reasoningResult.supportingPatterns[2]).toEqual({
      patternId: 'PATTERN_003',
      similarityScore: 0.85,
      successCaseOutline: '業務効率化ツール導入による成功事例',
      displayOrder: 3,
    });

    const allScoresEqual = reasoningResult.supportingPatterns.every(
      (pattern) => pattern.similarityScore === 0.85
    );
    expect(allScoresEqual).toBe(true);

    const displayOrders = reasoningResult.supportingPatterns.map((p) => p.displayOrder);
    expect(displayOrders).toEqual([1, 2, 3]);
  });
});