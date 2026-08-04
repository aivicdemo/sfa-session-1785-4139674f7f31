import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件マッチング機能', () => {
  // SCEN-181
  test('新規案件の顧客ID、業種、売上規模が全て一致する場合にマッチスコアが最大値となる', () => {
    const newDeal = {
      customerId: 'CUST-001',
      industry: '製造業',
      salesScale: '1000万円以上5000万円未満',
    };

    const pastSuccessCases = [
      {
        customerId: 'CUST-001',
        industry: '製造業',
        salesScale: '1000万円以上5000万円未満',
        successIndicator: true,
      },
      {
        customerId: 'CUST-001',
        industry: '製造業',
        salesScale: '1000万円以上5000万円未満',
        successIndicator: true,
      },
      {
        customerId: 'CUST-001',
        industry: '製造業',
        salesScale: '1000万円以上5000万円未満',
        successIndicator: true,
      },
    ];

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100),
    };

    const result = evaluatePatternRelevance(
      newDeal,
      pastSuccessCases,
      mockAIRecommendationEngine
    );

    expect(result.matchScore).toBe(100);
    expect(result.reasoning).toContain('顧客ID');
    expect(result.reasoning).toContain('業種');
    expect(result.reasoning).toContain('売上規模');
    expect(result.reasoning).toContain('全て一致');
  });
});