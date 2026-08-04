import { recordRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1075: [normal] 推奨履歴の記録と追跡 - 推奨根拠が推奨根拠テーブルに記録され、推奨履歴と紐づけられる
  test('推奨根拠が推奨根拠テーブルに正確に記録され、推奨履歴と外部キーで正しく紐づけられること', async () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationContent: {
          proposedApproach: 'デジタル変革支援パッケージの提案',
          proposedTiming: '2024-02-15T10:00:00Z',
          proposedQuantity: 1,
          confidenceScore: 92,
        },
        reasoningData: {
          reasoningType: 'SIMILAR_PATTERN_MATCH',
          matchScore: 92,
          explanationText: '過去3年間の製造業向け商談において、年商50億円の企業との成功パターンと高い一致度を検出',
          similarPatternIds: ['PATTERN-2023-001', 'PATTERN-2023-045'],
          pastSuccessReferenceIds: ['DEAL-2023-0156', 'DEAL-2023-0234'],
          createdAt: '2024-01-15T09:00:00Z',
        },
      }),
    };

    const inputCaseData = {
      customerId: 'CUST-001',
      customerIndustry: '製造業',
      customerAnnualRevenue: 5000000000,
      dealCondition: {
        stage: '初期接触',
        budget: 15000000,
        decisionTimeline: 90,
      },
      salesRepresentativeId: 'SALES-REP-042',
    };

    const recordedRecommendation = await recordRecommendationWithReasoning(
      inputCaseData,
      mockRecommendationEngine
    );

    expect(recordedRecommendation).toEqual({
      recommendationId: expect.any(String),
      customerId: 'CUST-001',
      recommendationContent: {
        proposedApproach: 'デジタル変革支援パッケージの提案',
        proposedTiming: '2024-02-15T10:00:00Z',
        proposedQuantity: 1,
        confidenceScore: 92,
      },
      recordedReasonings: [
        {
          reasoningId: expect.any(String),
          recommendationId: expect.any(String),
          reasoningType: 'SIMILAR_PATTERN_MATCH',
          matchScore: 92,
          explanationText: '過去3年間の製造業向け商談において、年商50億円の企業との成功パターンと高い一致度を検出',
          similarPatternIds: ['PATTERN-2023-001', 'PATTERN-2023-045'],
          pastSuccessReferenceIds: ['DEAL-2023-0156', 'DEAL-2023-0234'],
          createdAt: '2024-01-15T09:00:00Z',
        },
      ],
      recordedAt: expect.any(String),
      relationshipVerified: true,
    });

    expect(recordedRecommendation.recordedReasonings[0].recommendationId)
      .toBe(recordedRecommendation.recommendationId);

    expect(recordedRecommendation.recordedReasonings).toHaveLength(1);

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(inputCaseData);

    expect(recordedRecommendation.recordedReasonings[0].matchScore).toBe(92);
    expect(recordedRecommendation.recordedReasonings[0].reasoningType).toBe('SIMILAR_PATTERN_MATCH');
    expect(recordedRecommendation.recordedReasonings[0].similarPatternIds).toContain('PATTERN-2023-001');
    expect(recordedRecommendation.recordedReasonings[0].pastSuccessReferenceIds).toContain('DEAL-2023-0156');
  });
});