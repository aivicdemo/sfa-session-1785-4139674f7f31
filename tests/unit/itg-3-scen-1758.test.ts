import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1758
  test('推奨根拠の可視化機能 - 根拠抽出日時が月初のとき根拠を正しく分類する', async () => {
    const monthStartDateTime = '2024-01-01T00:00:00Z';
    const recommendationId = 'rec-001';
    const customerId = 'cust-001';
    const dealId = 'deal-001';

    const mockRecommendationData = {
      recommendationId,
      customerId,
      dealId,
      proposedApproach: 'Initial month contact strategy',
      extractedAt: monthStartDateTime,
      confidenceScore: 85,
      relatedSuccessPatterns: [
        {
          patternId: 'pattern-001',
          patternName: 'Month start engagement',
          is_month_start: true,
          successRate: 0.82,
          relatedDeals: ['deal-past-001', 'deal-past-002'],
        },
      ],
      supportingData: {
        customerAttributes: {
          industry: 'Finance',
          companySize: 'Large',
        },
        dealConditions: {
          dealStage: 'Prospecting',
          dealValue: 500000,
        },
        historicalPatterns: [
          {
            dealId: 'deal-past-001',
            closedDate: '2023-01-15T00:00:00Z',
            successIndicators: ['initial_contact_success', 'budget_aligned'],
          },
        ],
      },
    };

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue({
          reasoningExplanation:
            'Based on historical data, month-start engagement with Large Finance sector customers has a success rate of 82%. Initial contact patterns from similar deals (deal-past-001, deal-past-002) show high conversion when approaching at the beginning of the calendar month.',
          reasoningDetails: [
            {
              factor: 'Temporal Pattern',
              description:
                'Month-start engagement correlates with higher deal success',
              weight: 0.35,
            },
            {
              factor: 'Customer Segment',
              description:
                'Large Finance companies respond well to proactive outreach at period boundaries',
              weight: 0.40,
            },
            {
              factor: 'Historical Precedent',
              description:
                'Two similar deals closed successfully following this approach',
              weight: 0.25,
            },
          ],
          timestamp: monthStartDateTime,
        }),
    };

    const result = await explainRecommendationReasoning(
      mockRecommendationData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      status: 'classified',
      classificationCategory: 'month_start_pattern',
      extractedAt: monthStartDateTime,
      recommendationId,
      customerId,
      dealId,
      reasoning: {
        explanation:
          'Based on historical data, month-start engagement with Large Finance sector customers has a success rate of 82%. Initial contact patterns from similar deals (deal-past-001, deal-past-002) show high conversion when approaching at the beginning of the calendar month.',
        details: [
          {
            factor: 'Temporal Pattern',
            description:
              'Month-start engagement correlates with higher deal success',
            weight: 0.35,
          },
          {
            factor: 'Customer Segment',
            description:
              'Large Finance companies respond well to proactive outreach at period boundaries',
            weight: 0.4,
          },
          {
            factor: 'Historical Precedent',
            description:
              'Two similar deals closed successfully following this approach',
            weight: 0.25,
          },
        ],
      },
      classificationMetadata: {
        appliedPattern: {
          patternId: 'pattern-001',
          patternName: 'Month start engagement',
          is_month_start: true,
          successRate: 0.82,
        },
        relatedSuccessCases: ['deal-past-001', 'deal-past-002'],
        matchConfidenceScore: 85,
        classificationTimestamp: monthStartDateTime,
      },
    });

    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(mockRecommendationData);
    expect(result.status).toBe('classified');
    expect(result.classificationCategory).toBe('month_start_pattern');
    expect(result.extractedAt).toBe('2024-01-01T00:00:00Z');
    expect(
      result.classificationMetadata.appliedPattern.is_month_start
    ).toBe(true);
    expect(result.classificationMetadata.relatedSuccessCases).toEqual([
      'deal-past-001',
      'deal-past-002',
    ]);
    expect(
      result.classificationMetadata.appliedPattern.successRate
    ).toBeCloseTo(0.82, 2);
  });
});