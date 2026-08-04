import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2772: 推奨根拠の可視化機能 - AIエージェント外部サービスが正常応答した場合、生成された推奨内容の根拠説明が取得される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: 'ビジネス課題ヒアリング→ROI試算提示',
        confidenceScore: 0.85,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanationText: '過去3年間の同業種成功案件15件中、予算500万円帯での成約率は78%。提案アプローチ「経営課題ヒアリング→ROI試算提示」の採用で成約率が向上しています',
        referencedSuccessPatternCount: 15,
        applicabilityScore: 0.78,
      }),
    };

    const dealContext = {
      industry: 'IT',
      budget: 5000000,
      mainChallenge: '業務効率化',
      dealStage: 'initial_contact',
    };

    const recommendationInput = {
      customerId: 'cust-002',
      customerIndustry: 'IT',
      budgetAmount: 5000000,
      businessChallenge: '業務効率化',
      dealConditions: {
        decisionMakerCount: 2,
        decisionTimelineWeeks: 8,
        competitionStatus: 'single_vendor',
      },
    };

    await mockAIEngine.generateRecommendation(recommendationInput);

    const result = await explainRecommendationReasoning(
      {
        recommendationId: 'rec-001',
        proposalApproach: 'ビジネス課題ヒアリング→ROI試算提示',
        industrySegment: 'IT',
        budgetRange: '5000000',
      },
      mockAIEngine,
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec-001',
        proposalApproach: 'ビジネス課題ヒアリング→ROI試算提示',
        industrySegment: 'IT',
        budgetRange: '5000000',
      }),
    );

    expect(result).toEqual(
      expect.objectContaining({
        explanationText: expect.stringContaining('過去3年間の同業種成功案件15件中'),
        referencedSuccessPatternCount: 15,
        applicabilityScore: 0.78,
      }),
    );

    expect(typeof result.explanationText).toBe('string');
    expect(result.explanationText.length).toBeGreaterThan(0);
    expect(result.referencedSuccessPatternCount).toBe(15);
    expect(result.applicabilityScore).toBe(0.78);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(1.0);
  });
});