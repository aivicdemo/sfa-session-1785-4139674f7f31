import { analyzeProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 提案内容の標準プロセスとの照合', () => {
  // SCEN-2200
  test('提案ステップが標準プロセスより1ステップ少ないとき、不足ステップによる乖離が算出される', () => {
    const standardProcessSteps = [
      { stepId: 1, stepName: 'ヒアリング', sequenceOrder: 1 },
      { stepId: 2, stepName: '課題分析', sequenceOrder: 2 },
      { stepId: 3, stepName: 'ソリューション設計', sequenceOrder: 3 },
      { stepId: 4, stepName: '見積提示', sequenceOrder: 4 },
      { stepId: 5, stepName: '契約準備', sequenceOrder: 5 },
    ];

    const proposalSteps = [
      { stepId: 1, stepName: 'ヒアリング', sequenceOrder: 1 },
      { stepId: 2, stepName: '課題分析', sequenceOrder: 2 },
      { stepId: 4, stepName: '見積提示', sequenceOrder: 3 },
      { stepId: 5, stepName: '契約準備', sequenceOrder: 4 },
    ];

    const customerInfo = {
      customerId: 'cust_12345',
      industryType: 'manufacturing',
      companyScale: 'large',
    };

    const dealCondition = {
      dealId: 'deal_67890',
      proposedAmount: 5000000,
      timelineMonths: 3,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalContent: {
          proposalId: 'prop_abc123',
          steps: proposalSteps,
          description: 'Proposal with 4 steps',
        },
        standardProcess: {
          steps: standardProcessSteps,
          totalSteps: 5,
        },
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = analyzeProposalDeviation(
      customerInfo,
      dealCondition,
      mockAIEngine
    );

    expect(result.deviationDetails).toBeDefined();
    expect(result.deviationDetails.length).toBe(1);
    expect(result.deviationDetails[0]).toEqual({
      stepName: 'ソリューション設計',
      deviationType: 'missing',
      deviationCount: 1,
      severity: 'high',
      impactDescription:
        '提案プロセスに設計フェーズが欠落しており、顧客への技術的根拠提示が不十分になるリスク',
    });
    expect(result.deviationScore).toBe(1);
    expect(result.proposalStepCount).toBe(4);
    expect(result.standardStepCount).toBe(5);
  });
});