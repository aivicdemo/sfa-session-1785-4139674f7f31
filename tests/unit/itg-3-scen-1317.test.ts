import { evaluateProposalConstraintCompatibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  // SCEN-1317
  test('提案内容が0件のとき、照合対象なしとして処理される', () => {
    const customerConstraints = {
      customerId: 'CUST-20240115-001',
      budgetLimit: 1000000,
      implementationPeriodMonths: 3,
      allowedIndustries: ['Finance', 'Retail', 'Manufacturing'],
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const proposalContents: never[] = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      logs: [] as string[],
      info: function (message: string) {
        this.logs.push(message);
      },
    };

    const result = evaluateProposalConstraintCompatibility(
      customerConstraints,
      proposalContents,
      mockAIRecommendationEngine,
      mockLogger,
    );

    expect(result).toEqual([]);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(0);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(0);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(0);

    expect(mockLogger.logs.length).toBeGreaterThan(0);
    expect(mockLogger.logs.some((log) => log.includes('提案内容が0件のため照合対象がありません'))).toBe(
      true,
    );
  });
});