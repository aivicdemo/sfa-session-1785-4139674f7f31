import { generateProposalApproachRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチマッチング機能 - 顧客条件欠落時の処理', () => {
  // SCEN-2251
  test('新規案件の顧客条件が欠落しているときもマッチング処理が正常に進行する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposedApproach: 'standardApproach',
        confidenceScore: 75,
        successPatternId: 'pattern-101',
        estimatedAdoptionRate: 0.58,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern-101',
          customerIndustry: 'IT',
          companySize: null,
          budget: null,
          implementationPeriod: null,
          successRate: 0.72,
          matchScore: 0.68,
        },
        {
          patternId: 'pattern-102',
          customerIndustry: 'IT',
          companySize: null,
          budget: null,
          implementationPeriod: null,
          successRate: 0.65,
          matchScore: 0.62,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'pattern-101',
        relevanceScore: 0.75,
        applicabilityStatus: 'partialConditions',
        gaps: ['companySize', 'budget', 'implementationPeriod'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          '新規提案アプローチは顧客業種（IT）の過去成功事例から導出されました。スコア75は、IT業界での標準的な提案パターンに基づいています。',
        reasoningFactors: [
          { factor: 'industry_match', weight: 0.4, value: 0.85 },
          { factor: 'success_history', weight: 0.35, value: 0.72 },
          { factor: 'pattern_relevance', weight: 0.25, value: 0.68 },
        ],
      }),
    };

    const dealData = {
      dealId: 'deal-2251',
      customerName: 'XYZ Corporation',
      industry: 'IT',
      companySize: null,
      budget: null,
      implementationPeriod: null,
      salesRepId: 'rep-001',
    };

    const result = await generateProposalApproachRecommendation(
      dealData,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'deal-2251',
        customerName: 'XYZ Corporation',
        industry: 'IT',
        companySize: null,
        budget: null,
        implementationPeriod: null,
        salesRepId: 'rep-001',
      })
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'IT',
      })
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        patternId: 'pattern-101',
      })
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec-001',
        proposedApproach: 'standardApproach',
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        recommendationId: 'rec-001',
        status: 'completed',
        proposedApproach: 'standardApproach',
        confidenceScore: 75,
        successPatternId: 'pattern-101',
        estimatedAdoptionRate: 0.58,
        similarPatterns: expect.arrayContaining([
          expect.objectContaining({
            patternId: 'pattern-101',
            matchScore: 0.68,
          }),
        ]),
        relevanceEvaluation: expect.objectContaining({
          relevanceScore: 0.75,
          applicabilityStatus: 'partialConditions',
          gaps: expect.arrayContaining([
            'companySize',
            'budget',
            'implementationPeriod',
          ]),
        }),
        explanation: expect.stringContaining('IT業界'),
        displayStatus: 'completed',
        processingMessage:
          '提案アプローチの推奨が完了しました。（部分条件）',
      })
    );

    expect(result.status).toBe('completed');
    expect(result.displayStatus).toBe('completed');
    expect(result.confidenceScore).toBe(75);
    expect(result.estimatedAdoptionRate).toBe(0.58);
  });
});