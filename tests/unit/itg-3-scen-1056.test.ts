import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1056
  test('[normal] 推奨根拠に商談条件との照合結果が含まれる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealConditions = {
      industry: 'IT',
      budgetAmount: 10000000,
      implementationPeriodMonths: 3,
    };

    const recommendationResponse = {
      proposalApproach: 'クラウド導入支援プロジェクト',
      confidenceScore: 92,
      matchingAnalysis: {
        similaritySimilarityScore: 0.92,
        matchingConditions: {
          industry: 'IT',
          budgetRange: 'matched',
          implementationTimeline: 'matched',
        },
        unmatchedItems: [],
      },
      pastSuccessExamplesCount: 15,
      reasoningExplanation:
        '過去の成功事例15件と比較し、貴商談の顧客業種と予算規模で92%の類似度を確認',
    };

    mockAIRecommendationEngine.generateRecommendation.mockReturnValue(
      recommendationResponse,
    );

    const result = visualizeRecommendationReasoning(
      mockAIRecommendationEngine,
      dealConditions,
    );

    expect(result).toBeDefined();
    expect(result.matchingAnalysis).toBeDefined();
    expect(result.matchingAnalysis.similaritySimilarityScore).toBe(0.92);
    expect(result.matchingAnalysis.matchingConditions).toEqual({
      industry: 'IT',
      budgetRange: 'matched',
      implementationTimeline: 'matched',
    });
    expect(result.matchingAnalysis.unmatchedItems).toEqual([]);
    expect(result.reasoningExplanation).toContain('92%');
    expect(result.reasoningExplanation).toContain('15件');
    expect(result.reasoningExplanation).toContain('顧客業種');
    expect(result.reasoningExplanation).toContain('予算規模');
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      dealConditions,
    );
  });
});