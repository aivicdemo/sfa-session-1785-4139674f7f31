import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1709
  test('提案内容が1件のときスコアを0～100の範囲で小数第2位まで算出する', () => {
    const customerId = 'CUST-001';
    const dealCondition = {
      industry: 'manufacturing',
      companySize: 'large',
      annualRevenue: 5000000000,
      targetBudget: 100000000,
    };
    const proposalPattern = {
      patternId: 'PATTERN-001',
      relevanceScore: 0.85,
      successRateInHistoricalCases: 0.82,
      applicableIndustries: ['manufacturing', 'automotive'],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposals: [proposalPattern],
        timestamp: new Date('2024-01-15T10:00:00Z'),
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue(0.85),
    };

    const result = evaluatePatternRelevance(
      customerId,
      dealCondition,
      proposalPattern,
      mockAIEngine
    );

    expect(result).toBe(85);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(Number.isFinite(result)).toBe(true);

    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerId,
      dealCondition,
      proposalPattern
    );
  });
});