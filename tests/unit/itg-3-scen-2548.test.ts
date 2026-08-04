import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2548
  test('推奨根拠が1件のとき、1つの根拠が可視化される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '提案内容',
        reasonings: [
          {
            id: 'reason-001',
            explanation: '根拠の説明文',
            relevanceScore: 0.95
          }
        ]
      })
    };

    const input = {
      customerId: 'cust-12345',
      dealCondition: {
        industry: '製造業',
        companySize: '中堅企業',
        budget: 5000000
      }
    };

    const result = await generateRecommendation(input, mockAIEngine);

    expect(result.reasonings).toHaveLength(1);
    expect(result.reasonings[0].id).toBe('reason-001');
    expect(result.reasonings[0].explanation).toBe('根拠の説明文');
    expect(result.reasonings[0].relevanceScore).toBe(0.95);
    expect(result.recommendation).toBe('提案内容');
  });
});