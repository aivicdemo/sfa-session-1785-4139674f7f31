import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  let mockAIEngine: any;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };
  });

  // SCEN-2241
  test('should visualize recommendation reasoning with applicable pattern score and detailed rationale', () => {
    // Arrange
    const dealData = {
      customerIndustry: '製造業',
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    const recommendationContent = {
      proposalApproach: '生産効率化による原価削減提案',
      actionTiming: '即座',
    };

    const applicabilityScore = 0.87;

    const reasoningExplanation = '過去成功事例との類似度が高い（類似商談15件中14件が成約）、顧客業種が同じ製造業（成功率92%）、商談金額が成功パターン帯域内（300万～800万円）である';

    const evidenceData = {
      similarDealCount: 15,
      successfulDealCount: 14,
      industrySuccessRate: 92,
      amountRangeMin: 3000000,
      amountRangeMax: 8000000,
    };

    mockAIEngine.generateRecommendation.mockReturnValue(recommendationContent);
    mockAIEngine.evaluatePatternRelevance.mockReturnValue(applicabilityScore);
    mockAIEngine.explainRecommendationReasoning.mockReturnValue(reasoningExplanation);

    // Act
    const result = visualizeRecommendationReasoning(dealData, mockAIEngine);

    // Assert
    expect(result).toEqual({
      applicabilityScore: 0.87,
      reasoning: '過去成功事例との類似度が高い（類似商談15件中14件が成約）、顧客業種が同じ製造業（成功率92%）、商談金額が成功パターン帯域内（300万～800万円）である',
      evidenceBadges: [
        {
          label: '類似商談',
          value: 15,
        },
        {
          label: '成功件数',
          value: 14,
        },
        {
          label: '業種成功率',
          value: '92%',
        },
      ],
      hierarchicalDisplay: {
        level1_applicabilityScore: 0.87,
        level2_reasoning: '過去成功事例との類似度が高い（類似商談15件中14件が成約）、顧客業種が同じ製造業（成功率92%）、商談金額が成功パターン帯域内（300万～800万円）である',
        level3_evidenceItems: [
          {
            evidenceType: 'similarityWithPastCases',
            description: '類似商談15件中14件が成約',
            badgeValue: 14,
          },
          {
            evidenceType: 'industryMatch',
            description: '顧客業種が同じ製造業（成功率92%）',
            badgeValue: 92,
          },
          {
            evidenceType: 'dealAmountRange',
            description: '商談金額が成功パターン帯域内（300万～800万円）',
            badgeValue: 5000000,
          },
        ],
      },
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(dealData);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(dealData);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(dealData, recommendationContent);
  });
});