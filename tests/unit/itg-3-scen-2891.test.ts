import { assessFitToSalesProcess } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2891
  test('推奨内容の営業現場適合性判定 - 標準プロセスとの乖離度がちょうど 0% のときに適合性が最高と判定される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        deviationPercentage: 0,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationContent = {
      recommendationId: 'REC-001',
      customerInfo: {
        customerId: 'CUST-001',
        industryType: 'IT',
        companySize: 'LARGE',
      },
      dealCondition: {
        dealId: 'DEAL-001',
        dealStage: 'PROPOSAL',
        dealAmount: 1000000,
      },
      proposalApproach: {
        approachType: 'CONSULTATIVE',
        recommendedActions: ['INITIAL_MEETING', 'NEEDS_ANALYSIS'],
        estimatedClosingPeriod: 30,
      },
    };

    const result = assessFitToSalesProcess(
      recommendationContent,
      mockAIRecommendationEngine
    );

    expect(result.fitScore).toBe(100);
    expect(result.fitLevelRank).toBe('最高');
    expect(result.reasonMessage).toBe(
      '標準プロセスとの乖離度が0%です。推奨内容は営業現場で最適なアプローチです。'
    );
  });
});