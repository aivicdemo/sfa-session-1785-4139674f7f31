import { evaluateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2176
  test('提案プロセス乖離度の数値化 - 標準プロセス定義データが1件のときの照合', () => {
    const standardProcessId = 'PROC_001';
    const proposalData = {
      customerId: 'CUST_12345',
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealStage: 'proposal',
      proposedApproach: 'multi_stakeholder_engagement',
      proposalContent: 'comprehensive_solution',
      timeline: 30,
    };

    const mockAiEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.75),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const standardProcesses = [
      {
        id: standardProcessId,
        name: '標準提案プロセス1',
        stage: 'proposal',
        approach: 'multi_stakeholder_engagement',
        successRate: 0.82,
      },
    ];

    const result = evaluateProposalProcessDeviation(
      proposalData,
      standardProcesses,
      mockAiEngine
    );

    expect(result).toEqual({
      deviationScore: 0.75,
      standardProcessId: standardProcessId,
      isWithinRange: true,
    });

    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAiEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalData,
      expect.objectContaining({
        id: standardProcessId,
      })
    );

    expect(result.deviationScore).toBeGreaterThanOrEqual(0.0);
    expect(result.deviationScore).toBeLessThanOrEqual(1.0);
  });
});