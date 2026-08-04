import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-209
  test('成功パターンデータが重複を含むとき、重複が除去された上で推奨が実行される', async () => {
    const duplicateSuccessPatterns = [
      {
        customerSegment: 'IT',
        companySize: 'mid-market',
        challengePattern: 'DX推進',
        proposalApproach: 'クラウド移行による業務効率化',
        successRate: 0.82,
        patternKey: 'IT_mid-market_DX推進_cloud-migration'
      },
      {
        customerSegment: 'IT',
        companySize: 'mid-market',
        challengePattern: 'DX推進',
        proposalApproach: 'クラウド移行による業務効率化',
        successRate: 0.82,
        patternKey: 'IT_mid-market_DX推進_cloud-migration'
      },
      {
        customerSegment: 'IT',
        companySize: 'mid-market',
        challengePattern: 'DX推進',
        proposalApproach: 'データ分析基盤構築',
        successRate: 0.78,
        patternKey: 'IT_mid-market_DX推進_data-analytics'
      },
      {
        customerSegment: 'IT',
        companySize: 'mid-market',
        challengePattern: 'DX推進',
        proposalApproach: 'クラウド移行による業務効率化',
        successRate: 0.82,
        patternKey: 'IT_mid-market_DX推進_cloud-migration'
      }
    ];

    const deduplicateStub = jest.fn((patterns: typeof duplicateSuccessPatterns) => {
      const uniquePatterns = new Map();
      patterns.forEach((pattern) => {
        if (!uniquePatterns.has(pattern.patternKey)) {
          uniquePatterns.set(pattern.patternKey, pattern);
        }
      });
      return Array.from(uniquePatterns.values());
    });

    const findSimilarPatternsStub = jest.fn(
      (dedupedPatterns: typeof duplicateSuccessPatterns, inputCondition: any) => {
        return dedupedPatterns
          .map((pattern) => ({
            approach: pattern.proposalApproach,
            matchScore: 0.85,
            baseSuccessRate: pattern.successRate,
            applicableReason: `顧客セグメント「${pattern.customerSegment}」、企業規模「${pattern.companySize}」、課題「${pattern.challengePattern}」に合致`
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
      }
    );

    const explainRecommendationStub = jest.fn((recommendations: any, totalPatternCount: number, uniquePatternCount: number) => {
      return `${totalPatternCount}件の履歴パターンから${uniquePatternCount}件の類似パターンに統一された推奨です。最も適用可能な提案アプローチは「${recommendations[0].approach}」で、適合度スコアは${recommendations[0].matchScore * 100}%です。`;
    });

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async (customerInfo: any, dealCondition: any) => {
        const dedupedPatterns = deduplicateStub(duplicateSuccessPatterns);
        const recommendations = findSimilarPatternsStub(dedupedPatterns, { customerInfo, dealCondition });
        const explanation = explainRecommendationStub(
          recommendations,
          duplicateSuccessPatterns.length,
          dedupedPatterns.length
        );

        return {
          recommendations,
          reasoning: explanation,
          deduplicationApplied: true,
          originalPatternCount: duplicateSuccessPatterns.length,
          uniquePatternCount: dedupedPatterns.length
        };
      }),
      findSimilarPatterns: findSimilarPatternsStub,
      explainRecommendationReasoning: explainRecommendationStub,
      evaluatePatternRelevance: jest.fn()
    };

    const newDealCondition = {
      customerIndustry: 'IT',
      companySize: 'mid-market',
      mainChallenge: 'DX推進',
      dealStage: 'initial-contact',
      budgetDecided: false
    };

    const result = await generateRecommendation(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result.deduplicationApplied).toBe(true);
    expect(result.originalPatternCount).toBe(4);
    expect(result.uniquePatternCount).toBe(2);
    expect(result.recommendations).toHaveLength(2);
    expect(result.recommendations[0].approach).toBe('クラウド移行による業務効率化');
    expect(result.recommendations[0].matchScore).toBe(0.85);
    expect(result.recommendations[1].approach).toBe('データ分析基盤構築');
    expect(result.recommendations[1].matchScore).toBe(0.85);

    expect(result.reasoning).toMatch(/4件の履歴パターンから2件の類似パターンに統一された推奨です/);
    expect(result.reasoning).toMatch(/クラウド移行による業務効率化/);
    expect(result.reasoning).toMatch(/適合度スコアは85%です/);

    expect(deduplicateStub).toHaveBeenCalledWith(duplicateSuccessPatterns);
    expect(deduplicateStub).toHaveBeenCalledTimes(1);
    expect(findSimilarPatternsStub).toHaveBeenCalled();

    const callOrder = [deduplicateStub.mock.invocationCallOrder[0], findSimilarPatternsStub.mock.invocationCallOrder[0]];
    expect(callOrder[0]).toBeLessThan(callOrder[1]);
  });
});