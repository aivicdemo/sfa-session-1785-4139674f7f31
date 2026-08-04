import { analyzeProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案プロセス標準照合', () => {
  test('SCEN-2199: 提案ステップが標準プロセスより1ステップ多いとき、余剰ステップによる乖離が算出される', () => {
    const standardProcessSteps = 5;
    const proposalSteps = 6;

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        steps: Array.from({ length: proposalSteps }, (_, i) => ({
          stepNumber: i + 1,
          description: `Step ${i + 1}`,
        })),
        recommendedApproach: 'Test Approach',
        confidence: 0.85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      standardProcessStepCount: standardProcessSteps,
      proposalContent: {
        steps: Array.from({ length: proposalSteps }, (_, i) => ({
          stepNumber: i + 1,
          description: `Proposal Step ${i + 1}`,
        })),
        customerCondition: {
          industry: 'Technology',
          companySize: 'Large',
        },
        proposalApproach: 'Standard Approach',
      },
      aiEngine: mockAIEngine,
    };

    const result = analyzeProposalDeviation(input);

    expect(result.surplusSteps).toBe(1);
    expect(result.deviationScore).toBe(0.2);
    expect(result.deviationType).toBe('surplus');
    expect(result).toEqual({
      surplusSteps: 1,
      deviationScore: 0.2,
      deviationType: 'surplus',
    });
  });
});