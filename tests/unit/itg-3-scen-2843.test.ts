import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・提案アプローチ推奨機能', () => {
  // SCEN-2843
  test('新規案件の商談条件が過去成功パターンと部分的に一致した場合、適用可能スコアが中程度に算出される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const pastPattern1 = {
      industry: '製造業',
      dealSize: '500万円～1000万円',
      decisionTimeline: '3ヶ月以内',
      mainChallenge: '業務効率化',
      relevanceScore: 0.8,
    };

    const pastPattern2 = {
      industry: '製造業',
      dealSize: '1000万円～3000万円',
      decisionTimeline: '6ヶ月以上',
      mainChallenge: 'コスト削減',
      relevanceScore: 0.3,
    };

    const similarPatterns = [pastPattern1, pastPattern2];

    mockAIRecommendationEngine.findSimilarPatterns.mockReturnValue(
      similarPatterns
    );

    const currentDealCondition = {
      industry: '製造業',
      dealSize: '500万円～1000万円',
      decisionTimeline: '3ヶ月以内',
      mainChallenge: '業務効率化',
    };

    const applicabilityScore = 0.55;
    const applicabilityStatus = '部分的に適用可能';

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue({
      score: applicabilityScore,
      status: applicabilityStatus,
    });

    const reasoningExplanation =
      '過去の製造業案件と業種・決定時期が一致し、規模・課題設定が異なるため、部分的な適用となります';

    mockAIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      reasoningExplanation
    );

    const result = evaluatePatternRelevance(
      currentDealCondition,
      mockAIRecommendationEngine
    );

    expect(result.applicabilityScore).toBe(0.55);
    expect(result.applicabilityStatus).toBe('部分的に適用可能');
    expect(result.reasoning).toBe(
      '過去の製造業案件と業種・決定時期が一致し、規模・課題設定が異なるため、部分的な適用となります'
    );

    expect(
      mockAIRecommendationEngine.findSimilarPatterns
    ).toHaveBeenCalledWith(currentDealCondition);
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith(currentDealCondition, similarPatterns);
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(currentDealCondition, 0.55, similarPatterns);
  });
});