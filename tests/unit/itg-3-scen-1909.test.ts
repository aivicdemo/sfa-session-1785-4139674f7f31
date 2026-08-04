import { evaluateRecommendationExplanation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1909
  test('推奨スコアが閾値直上（0.81）のときに根拠が適用される', () => {
    const RECOMMENDATION_SCORE_THRESHOLD = 0.80;
    const RECOMMENDATION_SCORE = 0.81;
    const EXPECTED_SUCCESS_RATE = 80;
    const EXPECTED_SIMILAR_CASES_COUNT = 15;
    const EXPECTED_SUCCESSFUL_CASES_COUNT = 12;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-20240115-001',
        proposalApproach: '顧客ニーズに合わせたカスタマイズ提案',
        recommendedTimingText: '即座にフォローアップ',
        createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(RECOMMENDATION_SCORE),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        `過去${EXPECTED_SIMILAR_CASES_COUNT}年間の類似案件${EXPECTED_SIMILAR_CASES_COUNT}件中${EXPECTED_SUCCESSFUL_CASES_COUNT}件が成功し、成功率${EXPECTED_SUCCESS_RATE}%以上の提案パターンです`
      ),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const dealData = {
      dealId: 'deal-20240115-001',
      customerIndustry: '製造業',
      budgetAmountInMillions: 10,
      decisionMakerCount: 3,
      description: 'テスト商談',
    };

    const result = evaluateRecommendationExplanation(
      dealData,
      mockAIRecommendationEngine,
      RECOMMENDATION_SCORE_THRESHOLD
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(dealData);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(result.isRecommendationVisible).toBe(true);
    expect(result.recommendationScore).toBe(RECOMMENDATION_SCORE);
    expect(result.recommendationScoreThreshold).toBe(RECOMMENDATION_SCORE_THRESHOLD);

    expect(result.explanationText).toMatch(/過去\d+年間の類似案件/);
    expect(result.explanationText).toMatch(/成功率\d+%以上/);
    expect(result.explanationText.length).toBeGreaterThan(0);
    expect(result.explanationText).not.toMatch(/[<>]/);

    const expectedExplanationContent = `過去${EXPECTED_SIMILAR_CASES_COUNT}年間の類似案件${EXPECTED_SIMILAR_CASES_COUNT}件中${EXPECTED_SUCCESSFUL_CASES_COUNT}件が成功し、成功率${EXPECTED_SUCCESS_RATE}%以上の提案パターンです`;
    expect(result.explanationText).toBe(expectedExplanationContent);

    expect(result.domSection).toBeDefined();
    expect(result.domSection.sectionTitle).toBe('推奨根拠');
    expect(result.domSection.sectionContent).toBe(result.explanationText);
    expect(result.domSection.isRendered).toBe(true);
  });
});