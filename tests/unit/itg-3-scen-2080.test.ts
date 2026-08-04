import { analyzeProposalAndCustomerPattern } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案内容と顧客対応パターンの標準プロセス照合分析', () => {
  // SCEN-2080
  test('提案内容の乖離スコアが49のとき、軽微な乖離と判定される', () => {
    const proposalContent = {
      approach: 'Value-based selling approach',
      targetCustomerType: 'Enterprise',
      proposedTimeline: 'Q2 2024',
      budgetRange: 'High',
    };

    const customerResponsePattern = {
      responseTime: 'Within 2 weeks',
      engagementLevel: 'High',
      decisionMakingProcess: 'Committee-based',
      historicalSuccessRate: 0.78,
    };

    const standardProcess = {
      expectedApproach: 'Value-based selling approach',
      expectedTimeline: 'Q1-Q2 2024',
      expectedEngagementLevel: 'High',
      successPatternMatch: 0.85,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        deviationScore: 49,
        patternMatchConfidence: 0.75,
      }),
    };

    const analysisResult = analyzeProposalAndCustomerPattern(
      proposalContent,
      customerResponsePattern,
      standardProcess,
      mockAIEngine
    );

    expect(analysisResult.deviationScore).toBe(49);
    expect(analysisResult.deviationLevel).toBe('MINOR_DEVIATION');
    expect(analysisResult.applicability).toBe('CONDITIONAL_APPLY');
    expect(analysisResult.confidence).toBe(0.75);
  });
});