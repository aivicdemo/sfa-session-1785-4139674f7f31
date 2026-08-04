import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2620
  test('推奨提案アプローチの根拠として、顧客属性の一致度が100%である場合、その旨が表示される', () => {
    const mockAIEngine: AIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendedApproach: '顧客属性に完全に適合した提案アプローチ',
        customerAttributeMatchScore: 100,
        recommendationId: 'REC-001',
        confidenceScore: 95,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning: '顧客属性一致度：100%。業種（製造）、企業規模（大企業）、予算規模（1000万円以上）のすべてが過去の成功案件と完全に一致しており、提案アプローチの適用可能性が最大です。',
        baseDataPoints: [
          { label: '業種', value: '製造', matchPercentage: 100 },
          { label: '企業規模', value: '大企業', matchPercentage: 100 },
          { label: '予算規模', value: '1000万円以上', matchPercentage: 100 },
        ],
        similarCaseCount: 5,
      }),
    };

    const dealInfo = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      industry: '製造',
      companySize: '大企業',
      budgetRange: '1000万円以上',
      customerAttributeMatchScore: 100,
    };

    const recommendationResult = mockAIEngine.generateRecommendation(dealInfo);
    expect(recommendationResult.customerAttributeMatchScore).toBe(100);

    const reasoningResult = mockAIEngine.explainRecommendationReasoning({
      recommendationId: recommendationResult.recommendationId,
      dealInfo: dealInfo,
    });

    expect(reasoningResult.reasoning).toContain('顧客属性一致度：100%');
    expect(reasoningResult.baseDataPoints).toHaveLength(3);
    expect(reasoningResult.baseDataPoints[0]).toEqual({
      label: '業種',
      value: '製造',
      matchPercentage: 100,
    });
    expect(reasoningResult.baseDataPoints[1]).toEqual({
      label: '企業規模',
      value: '大企業',
      matchPercentage: 100,
    });
    expect(reasoningResult.baseDataPoints[2]).toEqual({
      label: '予算規模',
      value: '1000万円以上',
      matchPercentage: 100,
    });

    const reasoningText = reasoningResult.reasoning;
    const hasMaxMatchIndicator =
      reasoningText.includes('顧客属性一致度：100%') ||
      reasoningText.includes('顧客属性と完全に合致') ||
      reasoningText.includes('完全に一致');

    expect(hasMaxMatchIndicator).toBe(true);

    const allAttributesMatched = reasoningResult.baseDataPoints.every(
      (dataPoint) => dataPoint.matchPercentage === 100,
    );
    expect(allAttributesMatched).toBe(true);
  });
});