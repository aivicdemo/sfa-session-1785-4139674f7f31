import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-737: [error] 推奨根拠の可視化と説明生成機能 - 推奨根拠の信頼スコアが0.5未満のとき推奨内容の信頼度が低いと表示される
  test('信頼スコア0.45の場合、信頼度が低いと表示されること', async () => {
    const recommendationId = 'rec-001';
    const confidenceScore = 0.45;
    const customerAttributes = {
      industry: 'manufacturing',
      revenue: 50000000,
      employeeCount: 150,
    };
    const dealConditions = {
      dealValue: 5000000,
      dealStage: 'proposal',
      daysInStage: 14,
    };
    const successPatterns = [
      {
        patternId: 'pattern-001',
        description: 'Successful approach for manufacturing companies over 100 employees',
        relevanceScore: 0.45,
      },
    ];
    const recommendedApproach = {
      approachDescription: 'Focus on operational efficiency benefits',
      suggestedActions: ['Schedule follow-up meeting', 'Prepare ROI analysis'],
      estimatedSuccessProbability: 0.45,
    };

    const mockAiEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.45),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          'Based on similar manufacturing cases with comparable deal values, this approach has shown moderate success rates.',
        confidenceLevel: 'low',
        reasoningDetails: {
          matchedPatterns: 1,
          similarCaseCount: 8,
          successRate: 0.45,
        },
      }),
    };

    const result = await explainRecommendationReasoning(
      recommendationId,
      customerAttributes,
      dealConditions,
      successPatterns,
      recommendedApproach,
      mockAiEngine
    );

    expect(result.confidenceLevel).toBe('low');
    expect(result.explanation).toBeDefined();
    expect(result.explanation).toContain('moderate success rates');
    expect(result.reasoningDetails.successRate).toBe(0.45);
    expect(result.reasoningDetails.successRate).toBeLessThan(0.5);
  });
});