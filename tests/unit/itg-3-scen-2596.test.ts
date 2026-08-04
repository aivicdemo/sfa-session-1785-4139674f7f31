import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2596
  test('顧客属性の企業規模が成功パターンと一致する場合、推奨アプローチが正しく返却される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-0042',
          approachName: '既存導入企業への参考事例提示',
          successRate: 0.78,
          customerSegment: {
            companySize: 'mid_market',
            employeeRangeMin: 500,
            employeeRangeMax: 1999,
          },
          recommendedActions: ['present_case_studies', 'reference_existing_clients'],
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: 'PAT-0042',
        matchingScore: 0.78,
        isApplicable: true,
        evaluationDetails: {
          companySizeMatch: true,
          companySizeReason: 'match',
        },
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'This pattern matches based on company size criteria.',
      ),
    };

    const customerAttributes = {
      companySize: 'mid_market',
      employeeCount: 1200,
      industry: 'manufacturing',
      annualRevenue: 5000000,
    };

    const dealConditions = {
      productCategory: 'enterprise_software',
      proposedAmount: 150000,
      dealStage: 'needs_analysis',
    };

    const systemLog: Array<{
      timestamp: string;
      eventType: string;
      filterName: string;
      status: string;
    }> = [];

    const result = evaluatePatternRelevance(
      customerAttributes,
      dealConditions,
      mockAIRecommendationEngine,
      systemLog,
    );

    expect(result.patternId).toBe('PAT-0042');
    expect(result.recommendedApproach).toBe('既存導入企業への参考事例提示');
    expect(result.matchingScore).toBeGreaterThanOrEqual(0.78);
    expect(result.isApplicable).toBe(true);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      customerAttributes,
      dealConditions,
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    const companySizeLogEntry = systemLog.find((log) => log.filterName === 'companySize');
    expect(companySizeLogEntry).toBeDefined();
    if (companySizeLogEntry) {
      expect(companySizeLogEntry.status).toBe('match');
      expect(companySizeLogEntry.eventType).toBe('pattern_evaluation');
    }
  });
});