import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1930
  test('根拠情報が0件のときに根拠なし状態で表示される', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning: '根拠情報がありません',
        patterns: [],
        scoreDetails: [],
      }),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      industry: 'IT',
      companySize: 'large',
      budget: 5000000,
      timeline: '2025-Q2',
    };

    const result = displayRecommendationReasoning(
      dealCondition,
      mockAIEngine
    );

    expect(result).toHaveProperty('displayArea');
    expect(result.displayArea).toBe(true);
    expect(result).toHaveProperty('message');
    expect(result.message).toBe('根拠情報がありません');
    expect(result).toHaveProperty('patternCount');
    expect(result.patternCount).toBe(0);
    expect(result).toHaveProperty('hasDetailedData');
    expect(result.hasDetailedData).toBe(false);
    expect(Array.isArray(result.patterns)).toBe(true);
    expect(result.patterns.length).toBe(0);
  });
});